import fitz
import PyPDF2
import tempfile
from PIL import Image
from collections import Counter
import pandas as pd
import json
import os
import shutil
import random

def get_page_rect(page):
    text_blocks = page.get_text("blocks")
    text_blocks = [block for block in text_blocks if not block[4].strip().isnumeric()]
    if not text_blocks:
        return page.rect[0], page.rect[1], page.rect[2], page.rect[3], page.rect[3]
    # blocks = page.get_text("dict", flags=11)["blocks"]
    x_counts_left = Counter(int(block[0]) for block in text_blocks)
    x_counts_right = Counter(int(block[2]) for block in text_blocks)
    max_y_down, max_x_right = 0, 0
    for idx, block in enumerate(text_blocks):
        if block[2] > max_x_right:
            max_x_right = block[2]
        if block[3] > max_y_down:
            max_y_down = block[3]
    try:
        most_common_x_left = x_counts_left.most_common(1)[0][0]
    except:
        print(x_counts_left.most_common(1), x_counts_left)
        print(text_blocks)
    most_common_x_right = x_counts_right.most_common(1)[0][0]
    return most_common_x_left, page.rect[1], min(page.rect[2], max_x_right), min(page.rect[3], max_y_down), most_common_x_right


def count_words(sentence, separators=["\n", " "]):
    for sep in separators:
        sentence = sentence.replace(sep, " ")
    words = sentence.split(" ")
    return len(words)

def paragraph_pretier(paragraph):
    paragraph = paragraph.replace('\n', ' ').replace('-\n', ' ')
    return paragraph

def process_page_text(page):
    page_content = []
    for block in page:
        if block[4] and not drop_p_with_unnecessary_words(block[4]) and len(block[4])>100:
            page_content.append(block[4])
    return page_content

def p_ended(content):
    content_ = paragraph_pretier(content).replace(' ', '').replace('-', '')
    if len(content_)<2:
        return False
    if content_[-1] in '.?!':
        return True
    return False

def p_started(content):
    content_ = paragraph_pretier(content).replace(' ', '').replace('-', '')
    if len(content_)<2:
        return False
    if content_[0].isalpha() and not content_[0].isupper():
        return False
    return True

def unite_divided_paragraphs(page):
    content = []
    for block in page:
        if len(content)==0:
            content.append(block)
        else:
            if p_ended(content[-1]):
                content.append(block)
            else:
                content[-1] += block
    return content

drop_words = ['chapter', 'figure', 'table', 'section', 'page', 'reference', 'references', '<image:']
def drop_p_with_unnecessary_words(content:str):
    content_ = content[:20].lower().replace(' ', '').replace('-', '')
    for word in drop_words:
        if word in content_:
            return True
    return False

def extract_paragraphs_from_page(pdf_path, page1, page2=None):
    pdf = fitz.open(pdf_path)
    
    if page2 is None:
        page2 = page1
    
    pages = []
    for p_num in range(page1, page2+1):
        page = process_page_text(pdf[p_num].get_text("blocks"))
        page = unite_divided_paragraphs(page)
        if p_num-1>=0:
            if len(pages)==0:
                ext_p = process_page_text(pdf[page1-1].get_text("blocks"))[-1]
            else:
                ext_p = pages[-1][-1]
            
            if not ext_p[-1] in ['.']:
                print(ext_p, page[0])
                page[0] = ext_p + page[0]
                if len(pages)>0:
                    pages[-1].pop()
        content = []
        for block in page:
            if not p_started(block) or not p_ended(block) or len(block)<500:
                continue
            content.append(paragraph_pretier(block))
        pages.append(content)
    
    end_page = pages[-1]
    if page2+1<len(pdf):
        ext_p = process_page_text(pdf[page2+1].get_text("blocks"))[0]
        if not end_page[-1][-1] in ['.']:
            end_page[-1] = paragraph_pretier(end_page[-1] + ext_p)
    
    return pages

def extract_metadata(pdf_path):
    with open(pdf_path, 'rb') as f:
        pdf = PyPDF2.PdfReader(f)
        information = pdf.metadata
        number_of_pages = len(pdf.pages)

    txt = f"""
    Information about {pdf_path}: 
    - Author: {information.author}
    - Creator: {information.creator}
    - Producer: {information.producer}
    - Subject: {information.subject}
    - Title: {information.title}
    - Number of pages: {number_of_pages}
    - metadata: {information}
    """

    print(txt)
    return information

def extract_pdf_metadata(pdf_file):
    cover_image = None
    author = None

    try:
        pdf_document = fitz.open(stream=pdf_file.read(), filetype="pdf")
        if pdf_document.page_count > 0:
            first_page = pdf_document.load_page(0)
            cover_image = first_page.get_pixmap()
        metadata = pdf_document.metadata
        author = metadata.get("author")

    except Exception as e:
        print(f"Error extracting PDF metadata: {e}")

    return cover_image, author

def save_cover_image(pixmap):
    _, temp_pil_image_path = tempfile.mkstemp(suffix='.png')
    pixmap_pil = Image.frombytes("RGB", [pixmap.width, pixmap.height], pixmap.samples)
    pixmap_pil.save(temp_pil_image_path)
    return temp_pil_image_path

def translate_csv_to_json_coco(path='../../dataset_processing/output/dataset.csv', save_json_path='../../dataset_processing/output/traincoco.json'):
    data = pd.read_csv(path)

    images = []
    categories = []
    annotations = []

    category = {}
    category["supercategory"] = 'none'
    category["id"] = 0
    category["name"] = 'None'
    categories.append(category)

    data['fileid'] = data['filename'].astype('category').cat.codes
    data['categoryid']= pd.Categorical(data['class'],ordered= True).codes
    data['categoryid'] = data['categoryid']+1
    data['annid'] = data.index

    def image(row):
        image = {}
        image["height"] = row.height
        image["width"] = row.width
        image["id"] = row.fileid
        image["file_name"] = row.filename
        return image

    def category(row):
        category = {}
        category["supercategory"] = 'None'
        category["id"] = row.categoryid
        category["name"] = row[2]
        return category

    def annotation(row):
        annotation = {}
        area = (row.xmax -row.xmin)*(row.ymax - row.ymin)
        annotation["segmentation"] = []
        annotation["iscrowd"] = 0
        annotation["area"] = area
        annotation["image_id"] = row.fileid

        annotation["bbox"] = [row.xmin, row.ymin, row.xmax -row.xmin,row.ymax-row.ymin ]

        annotation["category_id"] = row.categoryid
        annotation["id"] = row.annid
        return annotation

    for row in data.itertuples():
        annotations.append(annotation(row))

    imagedf = data.drop_duplicates(subset=['fileid']).sort_values(by='fileid')
    for row in imagedf.itertuples():
        images.append(image(row))

    catdf = data.drop_duplicates(subset=['categoryid']).sort_values(by='categoryid')
    for row in catdf.itertuples():
        categories.append(category(row))

    data_coco = {}
    data_coco["images"] = images
    data_coco["categories"] = categories
    data_coco["annotations"] = annotations
    json.dump(data_coco, open(save_json_path, "w"), indent=4)

    num_images_to_select = 40

def combine_datasets(num_images_to_select=40, output_folder='../../dataset_processing/output/dataset_images'):
    combined_folder = os.path.join(output_folder, 'Combined')
    shutil.rmtree(combined_folder, ignore_errors=True)
    if not os.path.exists(combined_folder):
        os.makedirs(combined_folder)

    combined_data = []
    for folder_name in os.listdir(output_folder):
        folder_name = os.path.join(output_folder, folder_name)
        if os.path.isdir(folder_name) and os.path.basename(folder_name) != 'Combined':
            csv_file = None
            json_file = None
            image_folder = None

            for file_name in os.listdir(folder_name):
                if file_name.endswith('.csv'):
                    csv_file = os.path.join(folder_name, file_name)
                elif file_name.endswith('.json'):
                    json_file = os.path.join(folder_name, file_name)
                elif os.path.isdir(os.path.join(folder_name, file_name)):
                    image_folder = os.path.join(folder_name, file_name)

                if csv_file and json_file and image_folder:
                    df = pd.read_csv(csv_file)
                    unique_images = df['filename'].unique()

                    selected_images = random.sample(list(unique_images), num_images_to_select)

                    for image_name in selected_images:
                        selected_df = df[df['filename'] == image_name]

                        combined_data.extend(selected_df.values.tolist())

                        combined_subfolder = os.path.join(combined_folder, 'images')
                        if not os.path.exists(combined_subfolder):
                            os.makedirs(combined_subfolder)

                        for _, row in selected_df.iterrows():
                            image_name = row['filename']
                            source_image_path = os.path.join(image_folder, image_name)
                            dest_image_path = os.path.join(combined_subfolder, image_name)
                            shutil.copyfile(source_image_path, dest_image_path)

                    print(f"Processed folder: {folder_name}")
            
    combined_df = pd.DataFrame(combined_data, columns=df.columns)
    combined_csv_path = os.path.join(combined_folder, 'combined.csv')
    combined_df.to_csv(combined_csv_path, index=False)
    translate_csv_to_json_coco(combined_csv_path, os.path.join(combined_folder, 'combined_jsoncoco.json'))
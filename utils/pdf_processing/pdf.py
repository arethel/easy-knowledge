import os
from PIL import Image
import io
import cv2
import numpy as np
import requests
import PyPDF2
import fitz
import hashlib
import pdfplumber
from ebooklib import epub
from collections import Counter

def get_image_hash(image_data):
    return hashlib.md5(image_data).hexdigest()

def get_all_images(pdf_path, output_images_folder):
    pdf = fitz.open(pdf_path)
    counter = 1
    saved_images = set()
    # my_page = pdf[28]
    # img_matrix = my_page.get_pixmap(matrix=fitz.Matrix(1, 1), clip=[0, 0, 360, 150])
    # img_array = img_matrix.tobytes()
    # img_cv2 = cv2.imdecode(
    #     np.frombuffer(img_array, dtype=np.uint8),
    #     flags=cv2.IMREAD_COLOR
    # )
    # cv2.imwrite(f"{output_images_folder}/my_imageeeeee.png", img_cv2)
    for i in range(len(pdf)):
        page = pdf[i]
        images = page.get_images(full=True)
        for image in images:
            base_img = pdf.extract_image(image[0])
            image_data = base_img["image"]
            image_hash = get_image_hash(image_data)
            if image_hash in saved_images or len(image_data) < 1024:
                continue
            else:
                saved_images.add(image_hash)
            img = Image.open(io.BytesIO(image_data))
            extension = base_img["ext"]
            if not os.path.exists(output_images_folder):
                os.makedirs(output_images_folder)
            img.save(open(f"{output_images_folder}/image{counter}-pg{i}.{extension}", "wb"))
            counter += 1


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


def extract_text_from_pdf_pymupdf(pdf_path, output_txt_path):
    text_content = ""
    pdf = fitz.open(pdf_path)
    for page_num in range(pdf.page_count):
        page = pdf[page_num]
        text_content += page.get_text() + '\n'
    pdf.close()
    with open(output_txt_path, "w", encoding="utf-8") as txt_file:
        txt_file.write(text_content)


def transform_pdf_to_epub(pdf_path, epub_path):
    pdf_document = fitz.open(pdf_path)
    print(fitz.__version__)
    book = epub.EpubBook()
    book.set_title('Sample EPUB')
    book.set_language('en')
    #print(pdf_document.get_toc())

    for page_number in range(28, 35):#len(pdf_document)-535):
        page = pdf_document.load_page(page_number)
        #print(f"page: {type(page)}")

        chapter = epub.EpubHtml(title=f'Chapter {page_number + 1}', file_name=f'chapter_{page_number + 1}.xhtml', lang='en')
        elements = process_page(page)
        main_string = f'<h1>Page {page_number + 1}</h1>\n'
        for element in elements:
            if element["content"] != "":
                main_string += f'<p>{element["type"]}, {element["order"]}</p><p>{element["content"]}</p>\n'
        chapter.content = main_string
        book.add_item(chapter)
        book.spine.append(chapter)

    book.add_item(epub.EpubNcx())
    book.add_item(epub.EpubNav())
    epub_file_name = epub_path
    epub.write_epub(epub_file_name, book)

def show_image(item, title="", output_folder="./output/pages_images"):
    """Display a pixmap.

    Just to display Pixmap image of "item" - ignore the man behind the curtain.

    Args:
        item: any PyMuPDF object having a "get_pixmap" method.
        title: a string to be used as image title

    Generates an RGB Pixmap from item using a constant DPI and using matplotlib
    to show it inline of the notebook.
    """
    DPI = 150  # use this resolution
    import numpy as np
    import matplotlib.pyplot as plt

    # %matplotlib inline
    pix = item.get_pixmap(dpi=DPI)
    img = np.ndarray([pix.h, pix.w, 3], dtype=np.uint8, buffer=pix.samples_mv)
    plt.figure(dpi=DPI)  # set the figure's DPI
    plt.title(title)  # set title of image
    plt.axis('off')
    plt.imshow(img, extent=(0, pix.w * 72 / DPI, pix.h * 72 / DPI, 0))
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    output_file_path = os.path.join(output_folder, f"page_{item.number}.png")
    plt.savefig(output_file_path)

def count_words(sentence, separators=["\n", " "]):
    for sep in separators:
        sentence = sentence.replace(sep, " ")
    words = sentence.split(" ")
    return len(words)

def preprocess_text(text, page_rect, parag_lines, page):
    content = []
    text = [list(block) for block in text]
    
    for idx, block in enumerate(text):
        if len(content) == 0:
            content.append(block)
        if (count_words(block[4]) < 8 or len(block[4].replace(' ', '')) < 30 or block[2] - block[0] < 5) and p_ended(content[-1][4]):
            continue
        else:
            if block[2] > page_rect[2]:
                block[2] = page_rect[2]
            counter = 0
            for line in parag_lines:
                if fitz.Rect(block[:4]).intersects(line):
                    counter += 1
            # code for splitting big paragraph into smalle ones
            # if counter > 1 and parag_lines[0][1] - block[1] > 8:
            #     x_y_of_paragpaph = block[2:4]
            #     block[2:4] = [page_rect[2], parag_lines[0][1] - 0.5]
            #     block[4] = page.get_textbox(block[:4])
            #     text.insert(idx + 1, [page_rect[0], parag_lines[0][1], x_y_of_paragpaph[0], x_y_of_paragpaph[1], page.get_textbox([page_rect[0], parag_lines[0][1], x_y_of_paragpaph[0], x_y_of_paragpaph[1]])])
            # elif counter > 1 or (counter == 1 and len(parag_lines) == 1):
            #     x_y_of_paragpaph = block[2:4]
            #     block[:2] = [page_rect[0], parag_lines[0][1]]
            #     if counter > 1:
            #         block[2:4] = [page_rect[2], parag_lines[1][1] - 0.5]
            #     #print(f"{block[:4]}") if page.get_textbox(block[:4]) == "" or page.get_textbox(block[:4]) is None else print()
            #     block[4] = page.get_textbox(block[:4])
            #     text.insert(idx + 1, [page_rect[0], parag_lines[0][1], x_y_of_paragpaph[0], x_y_of_paragpaph[1], page.get_textbox([page_rect[0], parag_lines[0][1], x_y_of_paragpaph[0], x_y_of_paragpaph[1]])])
            #     parag_lines.pop(0)
            is_intersected = fitz.Rect(block[:4]).intersects(content[-1][:4])
                        
            if  (5 < content[-1][0] - block[0] < 20 and not (5 < block[1] - content[-1][3])) \
                or (is_intersected and block[1] < content[-1][3] - 6) \
                or ((not p_ended(content[-1][4]) or is_intersected) and block[0] > content[-1][0] > page_rect[0] + 3) \
                or content[-1][4].strip().endswith("-"):
                content[-1][4] += block[4]
                content[-1][0] = min(block[0], content[-1][0])
                content[-1][2] = max(block[2], content[-1][2])
                content[-1][3] = block[3]
            else:
                content.append(block)        
    return content

def get_page_rect(page):
    text_blocks = page.get_text("blocks")
    text_blocks = [block for block in text_blocks if not block[4].strip().isnumeric()]
    # blocks = page.get_text("dict", flags=11)["blocks"]
    x_counts_left = Counter(int(block[0]) for block in text_blocks)
    x_counts_right = Counter(int(block[2]) for block in text_blocks)
    max_y_down, max_x_right = 0, 0
    for idx, block in enumerate(text_blocks):
        if block[2] > max_x_right:
            max_x_right = block[2]
        if block[3] > max_y_down:
            max_y_down = block[3]
    
    most_common_x_left = x_counts_left.most_common(1)[0][0]
    most_common_x_right = x_counts_right.most_common(1)[0][0]
    return most_common_x_left, page.rect[1], min(page.rect[2], max_x_right), min(page.rect[3], max_y_down), most_common_x_right


def process_page(page):
    elements = []
    page_rect = get_page_rect(page)
    words = page.get_text("words")

    concatenated_paragraphs = []
    for idx, word in enumerate(words):
        if word[0] >= page_rect[4] and page_rect[4] - page_rect[0] > 250:
            if not fitz.Rect(word[:4]).intersects([page_rect[0], page_rect[1], page_rect[4], page_rect[3]]):
                page.add_redact_annot(word[:4])
        if page_rect[0] + 40 > word[0] > page_rect[0] + 10 and words[idx - 1][1] + 3 < word[1] and not word[4].isnumeric() and word[4].isalnum():
            word_to_place = list(word[:4])
            word_to_place[1] = (words[idx - 1][1] + word[3]) / 2
            concatenated_paragraphs.append(word_to_place)
    page.apply_redactions()
    page_rect = get_page_rect(page)
    text = page.get_text("blocks")

    if page.number == 28:
        print(len(concatenated_paragraphs))
    for elem in concatenated_paragraphs:
        page.draw_rect(elem, color=fitz.pdfcolor["blue"])
    preprocessed_text = preprocess_text(text, page_rect[:4], concatenated_paragraphs, page)
    for paragraph in preprocessed_text:
        page.draw_rect(paragraph[:4], color=fitz.pdfcolor["green"])
    
    # for word in words:
    #     page.draw_rect(word[:4], color=fitz.pdfcolor["blue"])
    page.draw_rect((page_rect[0], page_rect[1], page_rect[2], page_rect[3]), color=fitz.pdfcolor["red"])

    show_image(page)
    for element_number, paragraph in enumerate(preprocessed_text):
        elements.append({
            'page': page.number,
            'type': 'paragraph',
            'order': element_number,
            'content': paragraph
        })
    return elements


def determine_element_type(element):
    if element['content']:
        # You might need to improve these conditions based on your specific use case
        if "Image" in element['content']:
            return 'image'
        elif "Table" in element['content']:
            return 'table'
        else:
            return 'paragraph'
    else:
        # If there's no text content, it might be an image without text
        return 'image'

def generate_xhtml_content(elements):
    # Generate XHTML content based on the list of elements
    content = '<html><body>'
    for element in elements:
        content += f'<p>{element["type"]} on page {element["page"]}, order {element["order"]}</p>'
    content += '</body></html>'

    return content

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

def get_pdf_len(pdf_path):
    pdf = fitz.open(pdf_path)
    return len(pdf)

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


if __name__ == '__main__':
    pdf_path = "GRE.pdf"
    output_txt_path = "./output/output_text.txt"
    output_images_folder = "./output/images"

    # get_all_images(pdf_path, output_images_folder)
    # extract_metadata(pdf_path)
    # extract_text_from_pdf_pymupdf(pdf_path, output_txt_path)

    epub_path = 'output/output_book.epub'
    dest_file = './output/output.json'
    transform_pdf_to_epub(pdf_path, epub_path)
    # extract_paragraphs_from_page(pdf_path, 13)

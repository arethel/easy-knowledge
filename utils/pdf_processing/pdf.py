import os
from PIL import Image
import io
import requests
import PyPDF2
import fitz
import hashlib
import pdfplumber
from ebooklib import epub
from collections import Counter
import pytesseract

def get_image_hash(image_data):
    return hashlib.md5(image_data).hexdigest()

def get_all_images(pdf_path, output_images_folder):
    pdf = fitz.open(pdf_path)
    counter = 1
    saved_images = set()
    for i in range(len(pdf)):
        page = pdf[i]
        images = page.get_images()
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
            img.save(open(f"{output_images_folder}/image{counter}.{extension}", "wb"))
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

    for page_number in range(26, 30):#len(pdf_document)-535):
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


def preprocess_text(text, page_rect):
    content = []
    for block in text:
        block = list(block)
        if count_words(block[4]) < 8 or len(block[4].replace(' ', '')) < 30 or block[2] - block[0] < 5 :
            continue
        if len(content) == 0:
            content.append(block)
        else:
            if block[2] > page_rect[1]:
                block[2] = page_rect[1]
            if not (5 < abs(block[0] - content[-1][0]) < 10 and (-1 < block[0] - page_rect[0] < 1 or len(content[-1][4]) > 60)):
                content.append(block)
            else:
                content[-1][4] += block[4]
                content[-1][0] = min(block[0], content[-1][0])
                content[-1][2] = max(block[2], content[-1][2])
                content[-1][3] = block[3]
    return content

def get_most_common_x(page):
    text_blocks = page.get_text("blocks")
    x_counts_left = Counter(int(block[0]) for block in text_blocks)
    x_counts_right = Counter(int(block[2]) for block in text_blocks)
    
    most_common_x_left = x_counts_left.most_common(1)[0][0]
    most_common_x_right = x_counts_right.most_common(1)[0][0]
    return most_common_x_left, most_common_x_right


def process_page(page):
    elements = []
    text = page.get_text("blocks")
    #print(text[:15])
    #print(text)
    # table_finder = page.find_tables()
    # if table_finder.tables:
    #     for table in table_finder.tables:
    #         print(f"page {page.number + 1}: {table.bbox}")
    page_rect = get_most_common_x(page)
    preprocessed_text = preprocess_text(text, page_rect)
    for paragraph in preprocessed_text:
        page.draw_rect(paragraph[:4], color=fitz.pdfcolor["green"])
    page.draw_rect((page_rect[0], 0, page_rect[1], page.rect[3]), color=fitz.pdfcolor["red"])
    show_image(page)
    
    #print(f"paragraphs: {len(text)}")
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
        if block[4] and not '<image:' in block[4]:
            page_content.append(block[4])
    return page_content

def p_ended(content):
    content_ = paragraph_pretier(content).replace(' ', '').replace('-', '')
    if content_[-1] in '.?!':
        return True
    return False

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

def extract_paragraphs_from_page(pdf_path, page1, page2):
    pdf = fitz.open(pdf_path)
    
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
            content.append(paragraph_pretier(block))
        pages.append(content)
    
    end_page = pages[-1]
    if page2+1<len(pdf):
        ext_p = process_page_text(pdf[page2+1].get_text("blocks"))[0]
        if not end_page[-1][-1] in ['.']:
            end_page[-1] = paragraph_pretier(end_page[-1] + ext_p)
    
    return pages


if __name__ == '__main__':
    pdf_path = "ISLRv2.pdf"
    output_txt_path = "./output/output_text.txt"
    output_txt_path1 = "./output/output_text1.txt"
    output_txt_path2 = "./output/output_text2.txt"
    output_images_folder = "./output/images"

    # get_all_images(pdf_path, output_images_folder)
    # extract_metadata(pdf_path)
    # extract_text_from_pdf_pypdf2(pdf_path, output_txt_path)
    # extract_text_from_pdf_pymupdf(pdf_path, output_txt_path1)
    # extract_text_from_pdf_pdfplumber(pdf_path, output_txt_path2)

    epub_path = 'output/output_book.epub'
    dest_file = './output/output.json'
    # pdf_to_epub(pdf_path, epub_path)
    transform_pdf_to_epub(pdf_path, epub_path)
    #extract_paragraphs_from_page(pdf_path, 13)

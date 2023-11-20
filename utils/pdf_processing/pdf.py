import os
import PIL.Image
import io
import requests
import PyPDF2
import fitz
import hashlib
import pdfplumber
from ebooklib import epub

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
            img = PIL.Image.open(io.BytesIO(image_data))
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


def extract_text_from_pdf_pdfplumber(pdf_path, output_txt_path):
    with pdfplumber.open(pdf_path) as pdf:
        text_content = ""
        for page in pdf.pages:
            text_content += page.extract_text() + '\n'
    with open(output_txt_path, "w", encoding="utf-8") as txt_file:
        txt_file.write(text_content)


def extract_text_from_pdf_pymupdf(pdf_path, output_txt_path):
    text_content = ""
    pdf = fitz.open(pdf_path)
    for page_num in range(pdf.page_count):
        page = pdf[page_num]
        text_content += page.get_text() + '\n'
    pdf.close()
    with open(output_txt_path, "w", encoding="utf-8") as txt_file:
        txt_file.write(text_content)


def extract_text_from_pdf_pypdf2(pdf_path, output_txt_path):
    with open(pdf_path, "rb") as file:
        pdf_reader = PyPDF2.PdfReader(file)
        text_content = ""
        for page in pdf_reader.pages:
            text_content += page.extract_text() + '\n'
    with open(output_txt_path, "w", encoding="utf-8") as txt_file:
        txt_file.write(text_content)


def transform_pdf_to_epub(pdf_path, epub_path):
    pdf_document = fitz.open(pdf_path)
    print(fitz.__version__)
    book = epub.EpubBook()
    book.set_title('Sample EPUB')
    book.set_language('en')
    #print(pdf_document.get_toc())

    for page_number in range(len(pdf_document)-535):
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


def process_page(page):
    elements = []
    text = page.get_text("blocks")
    #print(text[:15])
    print(text)
    
    print(f"paragraphs: {len(text)}")
    # Iterate through paragraphs and add them as elements
    for element_number, paragraph in enumerate(text):
        elements.append({
            'page': page.number,
            'type': 'paragraph',
            'order': element_number,
            'content': text
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

def process_page(page):
    page_content = []
    for block in page:
        if block[4] and not '<image:' in block[4]:
            page_content.append(block[4])
    return page_content

def p_ended(content):
    content_ = paragraph_pretier(content).replace(' ', '').replace('-', '')
    if content_[-1] in ['.', '!', '?']:
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
        page = process_page(pdf[p_num].get_text("blocks"))
        page = unite_divided_paragraphs(page)
        if p_num-1>=0:
            if len(pages)==0:
                ext_p = process_page(pdf[page1-1].get_text("blocks"))[-1]
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
        ext_p = process_page(pdf[page2+1].get_text("blocks"))[0]
        if not end_page[-1][-1] in ['.']:
            end_page[-1] = paragraph_pretier(end_page[-1] + ext_p)
    
    return pages


if __name__ == '__main__':
    pdf_path = "BartoSutton.pdf"
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
    #transform_pdf_to_epub(pdf_path, epub_path)
    extract_paragraphs_from_page(pdf_path, 13)

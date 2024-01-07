import fitz
import PyPDF2
import tempfile
from PIL import Image
from collections import Counter

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
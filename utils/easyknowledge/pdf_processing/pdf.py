import os
print(os.getcwd())
from PIL import Image
import io
import timeit
from tqdm import tqdm
import time
import shutil
import re
import numpy as np
import requests
import PyPDF2
import fitz
import hashlib
import matplotlib.pyplot as plt
from ebooklib import epub
from pdf_utils import p_ended, count_words, get_page_rect

class EpubReader:
    def __init__(self, epub_filename):
        self.epub_filename = epub_filename
        self.book = epub.read_epub(epub_filename)

    def __len__(self):
        return len(self.book.items)

    def get_by_page(self, page_number, separator='-separator-'):
        elements = []
        for item in self.book.items:
            if isinstance(item, epub.EpubHtml):
                data = item.get_body_content().decode("utf-8")
                data = re.findall(r'<p>(.*?)</p>', data, re.DOTALL)
                if data:
                    data = data[0].split(separator)
                    if int(data[0]) == page_number:
                        elements.append({
                            "page": data[0].strip(),
                            "type": data[1].strip(),
                            "order": data[2].strip(),
                            "is_qa_flag": data[3].strip(),
                            "qa_content": data[4].strip(),
                            "content": data[5].strip()
                        })
        return elements

    def get_paragraph_by_qa(self):
        qa_contents = []
        sep = '-separator-'

        for item in self.book.items:
            if isinstance(item, epub.EpubHtml):
                data = item.get_body_content().decode("utf-8")
                data = re.findall(r'<p>(.*?)</p>', data, re.DOTALL)
                if data:
                    current_page = int(data[0].split(sep)[0].strip())
                    current_order = int(data[0].split(sep)[2].strip())
                    current_is_qa_flag = int(data[0].split(sep)[3].strip())

                    element = {
                        "page": current_page,
                        "order": current_order
                    }

                    if current_is_qa_flag == 1:
                        qa_contents.append(element)
        return qa_contents

    def add_questions_answers(self, page_number, order, qa_content):
        new_book = epub.EpubBook()
        new_book.set_title(self.book.get_metadata('DC', 'title')[0][0])
        new_book.set_language(self.book.get_metadata('DC', 'language')[0][0])

        executed = False
        for item in self.book.items:
            if isinstance(item, epub.EpubHtml):
                data = item.get_body_content().decode("utf-8")
                data = re.findall(r'<p>(.*?)</p>', data, re.DOTALL)
                if data:
                    sep = '-separator-'
                    current_page_number = int(data[0].split(sep)[0].strip())
                    current_type = data[0].split(sep)[1].strip()
                    current_order = int(data[0].split(sep)[2].strip())
                    current_content = data[0].split(sep)[5].strip()

                    if current_page_number == page_number and current_order == order:
                        is_qa_flag = 1
                        new_content = f'{page_number}{sep}{current_type}{sep}{order}{sep}{is_qa_flag}{sep}{qa_content}{sep}{current_content}'
                        new_item = epub.EpubHtml(title=item.title, file_name=item.file_name, lang='en', content=new_content.encode("utf-8"))
                        new_book.add_item(new_item)
                        executed = True
                    else:
                        new_book.add_item(item)
        if executed:
            new_book.add_item(epub.EpubNcx())
            new_book.add_item(epub.EpubNav())
            epub_file_name = self.epub_filename
            epub.write_epub(epub_file_name, new_book)
            self.book = epub.read_epub(self.epub_filename)
        else:
            print("Error: page number or order not found")

class PDFReader:
    def __init__(self, pdf_filename):
        self.pdf_filename = pdf_filename
        self.pdf = fitz.open(pdf_filename)

    def __len__(self):
        return len(self.pdf)

    def get_all_images(self, output_images_folder="./output/images", quality=95):
        # my_page = pdf[28]
        # img_matrix = my_page.get_pixmap(matrix=fitz.Matrix(1, 1), clip=[0, 0, 360, 150])
        # img_array = img_matrix.tobytes()
        # img_cv2 = cv2.imdecode(
        #     np.frombuffer(img_array, dtype=np.uint8),
        #     flags=cv2.IMREAD_COLOR
        # )
        # cv2.imwrite(f"{output_images_folder}/my_imageeeeee.png", img_cv2)
        shutil.rmtree(output_images_folder, ignore_errors=True)
        counter = 1
        saved_images = set()

        for i in range(len(self.pdf)):
            page = self.pdf[i]
            images = page.get_images()

            for image in images:
                base_img = self.pdf.extract_image(image[0])
                extension = base_img["ext"]
                image_data = base_img["image"]
                image_hash = hashlib.md5(image_data).hexdigest()

                if image_hash in saved_images or len(image_data) < 1024:
                    continue
                else:
                    saved_images.add(image_hash)

                img = Image.open(io.BytesIO(image_data))
                width, height = img.size
                if width / height > 10 or height / width > 10:
                    continue


                if not os.path.exists(output_images_folder):
                    os.makedirs(output_images_folder)

                image_filename = f"image{counter}-pg-{i+1}.{extension}"
                image_filepath = os.path.join(output_images_folder, image_filename)

                img.save(open(image_filepath, "wb"),
                    format=extension,
                    quality=quality,
                )

                file_size = os.path.getsize(image_filepath)
                new_image_filename = f"{image_filename}-{file_size}B.{extension}"
                new_image_filepath = os.path.join(output_images_folder, new_image_filename)
                if file_size < 5000:
                    os.remove(image_filepath)
                else:
                    os.rename(image_filepath, new_image_filepath)
                
                counter += 1
        
    def extract_full_text(self, output_txt_path="./output/output_text.txt"):
        text_content = ""
        for page_num in range(self.pdf.page_count):
            page = self.pdf[page_num]
            text_content += page.get_text() + '\n'
        with open(output_txt_path, "w", encoding="utf-8") as txt_file:
            txt_file.write(text_content)
    
    def to_epub(self, epub_path):
        book = epub.EpubBook()
        book.set_title('Sample EPUB')
        book.set_language('en')
        #print(self.pdf.get_toc())

        total_pages = len(self.pdf)
        progress_bar = tqdm(total=total_pages, desc="Converting to EPUB", unit="page")
        
        start_time = time.time()

        for page_number in range(len(self.pdf)):
            page = self.pdf.load_page(page_number)

            chapter = epub.EpubHtml(title=f'Chapter {page_number + 1}', file_name=f'chapter_{page_number + 1}.xhtml', lang='en')
            elements = self.process_page(page)
            # main_string = f'<h1>Page {page_number + 1}</h1>\n'
            # for element in elements:
            #     if element["content"] != "":
            #         main_string += f'<p>{element["type"]}, {element["order"]}</p><p>{element["content"]}</p>\n'
            # chapter.content = main_string
            # book.add_item(chapter)
            # book.spine.append(chapter)
            for idx, element in enumerate(elements):
                chapter = epub.EpubHtml(title=f'Chapter {page_number}', file_name=f'chapter_{page_number}_{idx}.xhtml', lang='en')
                sep = '-separator-'
                chapter.content = f'{element["page"]}{sep}{element["type"]}{sep}{element["order"]}{sep}{element["is_qa_flag"]}{sep}{element["qa_content"]}{sep}{element["content"]}'
                book.add_item(chapter)
                book.spine.append(chapter)
            
            progress_bar.update(1)
            progress = progress_bar.n / total_pages
            elapsed_time = time.time() - start_time
            time_per_page = elapsed_time / progress if progress > 0 else 0
            remaining_time = (1 - progress) * time_per_page

            yield progress, remaining_time
        
        progress_bar.close()

        book.add_item(epub.EpubNcx())
        book.add_item(epub.EpubNav())
        epub_file_name = epub_path
        epub.write_epub(epub_file_name, book)

    def preprocess_text(self, page, page_rect, parag_lines):
        content = []
        text = page.get_text("blocks")
        text = [list(block) for block in text]
        
        for idx, block in enumerate(text):
            if len(content) == 0:
                content.append(block)
                continue
            if (count_words(block[4]) < 8 or len(block[4].replace(' ', '')) < 30 or block[2] - block[0] < 5) and p_ended(content[-1][4]):
                for i in range(idx+1, len(text)):
                    text[i][5] -= 1
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
                    or (is_intersected and block[1] < content[-1][3] - 5) \
                    or ((not p_ended(content[-1][4]) or is_intersected) and block[0] > content[-1][0] > page_rect[0] + 3) \
                    or content[-1][4].strip().endswith("-"):
                    content[-1][4] += block[4]
                    content[-1][0] = min(block[0], content[-1][0])
                    content[-1][2] = max(block[2], content[-1][2])
                    content[-1][3] = block[3]
                    for i in range(idx+1, len(text)):
                        text[i][5] -= 1
                else:
                    content.append(block)        
        return content
    
    def show_image(self, page, title="", output_folder="../../dataset_processing/output/pages_images"):
        DPI = 150 
        # %matplotlib inline
        pix = page.get_pixmap(dpi=DPI)
        img = np.ndarray([pix.h, pix.w, 3], dtype=np.uint8, buffer=pix.samples_mv)
        plt.figure(dpi=DPI)
        plt.title(title)
        plt.axis('off')
        plt.imshow(img, extent=(0, pix.w * 72 / DPI, pix.h * 72 / DPI, 0))
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
        output_file_path = os.path.join(output_folder, f"page_{page.number}.png")
        plt.savefig(output_file_path)
        plt.close()
    
    def process_page(self, page, is_show_image=True):
        elements = []
        page_rect = get_page_rect(page)
        words = page.get_text("words")
        text = page.get_text("blocks")

        concatenated_paragraphs = []
        for idx, word in enumerate(words):
            if page_rect[4] - page_rect[0] > 250 and (word[0] >= page_rect[4] or (word[1] > page_rect[3])):
                if not fitz.Rect(word[:4]).intersects([page_rect[0], page_rect[1], page_rect[4], page_rect[3]]):
                    page.add_redact_annot(word[:4])
            if text[word[5]][0] + 40 > word[0] > text[word[5]][0] + 8 and words[idx - 1][1] + 3 < word[1] and not word[4].isnumeric() and word[4].isalnum():
                word_to_place = list(word[:4])
                word_to_place[1] = (words[idx - 1][1] + word[3]) / 2
                concatenated_paragraphs.append(word_to_place)
        page.apply_redactions()
        page_rect = get_page_rect(page)
        
        for elem in concatenated_paragraphs:
            page.draw_rect(elem, color=fitz.pdfcolor["blue"])

        preprocessed_text = self.preprocess_text(page, page_rect[:4], concatenated_paragraphs)
        for paragraph in preprocessed_text:
            page.draw_rect(paragraph[:4], color=fitz.pdfcolor["green"])
        # for word in words:
        #     page.draw_rect(word[:4], color=fitz.pdfcolor["blue"])
        page.draw_rect((page_rect[0], page_rect[1], page_rect[2], page_rect[3]), color=fitz.pdfcolor["red"])
        if is_show_image:
            self.show_image(page)
        for idx, block in enumerate(preprocessed_text):
            if block[6] == 0:
                type = 'text'
                content = block[4]
            else:
                type = 'image'
                content = 'link_to_image'
            elements.append({
                'page': page.number,
                'type': type,
                'order': block[5],
                'is_qa_flag': 0,
                'qa_content': '',
                'content': content
            })
        return elements

if __name__ == '__main__':
    pdf_path = "../../dataset_processing/ISLRv2.pdf"
    output_txt_path = "../../dataset_processing/output/output_text.txt"
    output_images_folder = "../../dataset_processing/output/images"
    epub_path = '../../dataset_processing/output/book.epub'

    pdf_book = PDFReader(pdf_path)
    #pdf_book.get_all_images(output_images_folder)
    #pdf_book.extract_full_text(output_txt_path)
    
    for progress, remaining_time in pdf_book.to_epub(epub_path):
        percentage = int(progress * 100)
        print(f"{percentage}% - Expected time left: {remaining_time:.2f} seconds")
    
    book = EpubReader(epub_path)
    print(len(book))
    print(book.get_by_page(29))
    #book.add_questions_answers(29, 1, "What is the meaning of life?")
    print(book.get_by_page(29))
    print(book.get_paragraph_by_qa())

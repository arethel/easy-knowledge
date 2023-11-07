import os
import PIL.Image
import io
import PyPDF2
import fitz
import hashlib

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
            if image_hash in saved_images:
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
    """

    print(txt)
    return information


def extract_text_from_pdf(pdf_path, output_txt_path):
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        text_content = ""
        for page in reader.pages:
            text_content += page.extract_text()
        with open(output_txt_path, "w", encoding="utf-8") as txt_file:
            txt_file.write(text_content)


if __name__ == '__main__':
    pdf_path = "sample.pdf"
    output_txt_path = "./output/output_text.txt"
    output_images_folder = "./output/images"

    extract_text_from_pdf(pdf_path, output_txt_path)
    get_all_images(pdf_path, output_images_folder)
    extract_metadata(pdf_path)

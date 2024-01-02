from ..pdf_processing.pdf import PDFReader, EpubReader
import random

def create_test(qa_count, marked_blocks):
    if len(marked_blocks) < qa_count:
        qa_count = len(marked_blocks)
    if qa_count == 0:
        return []
    qa = random.sample(marked_blocks, qa_count)
    return qa
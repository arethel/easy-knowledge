import JSZip from 'jszip';

class EpubReader {
    constructor() {
        this.zip = null;
    }

    async readEPUB(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const arrayBuffer = event.target.result;
                this.zip = await JSZip.loadAsync(arrayBuffer);
                resolve();
            };
            reader.onerror = (event) => {
                reject(new Error('Failed to read EPUB.'));
            };
            reader.readAsArrayBuffer(blob);
        });
    }

    async getBookLength() {
        if (!this.zip) {
            console.error('EPUB not loaded.');
            return 0;
        }

        const length = Object.keys(this.zip.files).filter((relativePath) => {
            return relativePath.endsWith('.xhtml');
        }).length;

        return length;
    }

    async get_by_page(page_number, separator = '-separator-') {
        const elements = [];

        if (!this.zip) {
            console.error('EPUB not loaded.');
            return elements;
        }

        await Promise.all(
            Object.keys(this.zip.files).map(async (relativePath) => {
                if (relativePath.endsWith('.xhtml')) {
                    const zipEntry = this.zip.file(relativePath);
                    const xhtmlContent = await zipEntry.async('string');

                    const data = xhtmlContent.match(/<p>(.*?)<\/p>/s);
                    if (data) {
                        const dataArray = data[1].split(separator);
                        if (parseInt(dataArray[0]) === page_number) {
                            elements.push({
                                page: dataArray[0].trim(),
                                type: dataArray[1].trim(),
                                order: dataArray[2].trim(),
                                is_qa_flag: dataArray[3].trim(),
                                qa_content: dataArray[4].trim(),
                                content: dataArray[5].trim(),
                            });
                        }
                    }
                }
            })
        );

        return elements;
    }
}

export default EpubReader;
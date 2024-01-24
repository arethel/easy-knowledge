import EpubReader from './EpubReader.js';

const getBook = async (book_id, client, loadedPDfs, setLoadedPDfs) => {
  try {
    const response = await client.get(`api/book?book_id=${book_id}`, {
      responseType: 'blob',
    });

    const blobData = response.data;
    const dataUrl = URL.createObjectURL(blobData);
    
    const newloadedPDfs = { ...loadedPDfs };
    newloadedPDfs[book_id] = dataUrl;
    setLoadedPDfs(newloadedPDfs);
    console.log('loaded');
  } catch (error) {
    console.error('Error fetching book:', error);
  }
};
  
export default getBook;
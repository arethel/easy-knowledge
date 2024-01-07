import EpubReader from './EpubReader.js';

const getBook = async (book_id, client, loadedEpubs, setLoadedEpubs) => {
    try {
      const response = await client.get(`api/book?book_id=${book_id}`, {
        responseType: 'blob',
      });
  
      const blobData = response.data;
      const epubReader = new EpubReader();
      await epubReader.readEPUB(blobData);
      const newloadedEpubs = { ...loadedEpubs };
      newloadedEpubs[book_id] = epubReader;
      setLoadedEpubs(newloadedEpubs);
      // console.log('loaded');
      
    } catch (error) {
      console.error('Error fetching book:', error);
    }
};
  
export default getBook;
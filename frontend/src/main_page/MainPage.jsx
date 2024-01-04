import React, { useState, useRef, useEffect } from "react";
import { Section } from "./Sections/Section";
import { TopBar } from "./TopBar";
import Divider from '@mui/material/Divider';
import { Logo } from "./Logo/Logo.jsx";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MySettings } from './Settings/MySettings';
import { AlertDialog } from './AlertDialog.jsx';
import './style.css'

const booksList = [
  {id: 1, name: 'Book1 Title Very Very Very Long Title'},
  {id: 2, name: 'Book2 Title'},
  {id: 3, name: 'Book3 Title'},
  {id: 4, name: 'Book4 Title'},
];

export const MainPage = ({ userData, client }) => {
  const sectionsContainerRef = useRef(null);
  const [sections, setSections] = useState([
    { id: 1, books: booksList, section_name: 'Artificial Intelligence' },
    { id: 2, books: booksList, section_name: 'Design' },
  ]);
  const [idCounter, setIdCounter] = useState(sections.length);
  const [showSettings, setShowSettings] = useState(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(null); // 'deleteBook' or 'deleteSection'
  const [loading, setLoading] = useState(true);

  const [actionConfirmation, setActionConfirmation] = useState({
    // type: null, // 'deleteBook' or 'deleteSection'
    id: null,   // Book or Section ID
    name: null, // Book or Section name
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get("api/section/all");
        //console.log(response.data)
        setSections(response.data.sections);
        setIdCounter(response.data.sections.length);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const handleActionConfirmation = (id, name) => {
    setActionConfirmation({ id, name });
    setOpen(true);
  };

  const handleClose = (confirmed) => {
    setOpen(false);
    const { id, name } = actionConfirmation;

    if (confirmed) {
      if (type === 'deleteSection') {
        handleDeleteSection(id);
      }
    }

    setActionConfirmation({ id: null, name: name });
  };

  const handleCreateSection = () => {
    const newSectionId = idCounter + 1;
    const newSection = {
      id: newSectionId,
      section_name: `New Section`,
      books: []      
    };
    setIdCounter(prevCounter => prevCounter + 1);
    setSections([...sections, newSection]);
  };

  const handleDeleteSection = (sectionId) => {
    const updatedSections = sections.filter(section => section.id !== sectionId);
    setSections(updatedSections);
  };

  useEffect(() => {
    if (sectionsContainerRef.current && sectionsContainerRef.current.lastChild) {
      const newSection = sectionsContainerRef.current.lastChild;
      const topPos = newSection.offsetTop + newSection.offsetHeight;
      window.scrollTo({ top: topPos, behavior: 'smooth' });
    }
  }, [sections]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <TopBar userData={userData} handleCreateSection={handleCreateSection} setShowSettings={setShowSettings}/>
        <AlertDialog open={open} handleClose={handleClose} actionConfirmation={actionConfirmation} type={type}/>
        <Divider variant="middle" className="main-divider" />
        <Logo />
        <div ref={sectionsContainerRef}> 
          {sections.map((section) => (
            <Section 
              key={section.id}
              sectionId={section.id}
              booksList={section.books}
              name={section.section_name}
              handleDeleteSection={handleActionConfirmation}
              setType={setType}
              client={client}
            />
          ))}
        </div>
        <MySettings active={showSettings} setActive={setShowSettings}/>
      </div>
    </DndProvider>
  );
}
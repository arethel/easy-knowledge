import React, { useState, useRef, useEffect } from "react";
import { Section } from "./Sections/Section";
import { TopBar } from "./TopBar";
import Divider from '@mui/material/Divider';
import { Logo } from "../books_reading/components/logo/Logo.jsx";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Settings } from "../books_reading/components/settings/Settings.jsx";
import { AlertDialog } from './AlertDialog.jsx';
import { MyCircularProgress } from './Sections/MyCircularProgress';
import { useTranslation } from "react-i18next";
import './style.css'
import MyAlert from "./MyAlert.jsx";

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
  const [showSettings, setShowSettings] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(
    localStorage.getItem("globalLoading") || 0
  );
  const { t } = useTranslation();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("globalLoading", globalLoading);
  }, [globalLoading]);

  const [actionConfirmation, setActionConfirmation] = useState({
    id: null,
    name: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get("api/section/all");
        console.log(response.data.sections);
        setSections(response.data.sections);
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
      handleDeleteSection(id);
    }

    setActionConfirmation({ id: null, name: name });
  };

  const handleCreateSection = async () => {
    try {
      const response = await client.post("api/section/", {
        section_name: t("new section")
      });

      if (response.data.error === 0) {
        const newSection = {
          id: response.data.section_id,
          section_name: response.data.section_name,
          books: []      
        };
        setSections([...sections, newSection]);
      } else if (response.data.error === 2) {
        console.error("Limit exceeded: ", response.data.details);
        //alert("Limit exceeded");
        setOpenAlert(true);
        setAlertMessage("Limit exceeded");
      } else {
        console.error("Failed to create section");
        //alert("Failed to create section");
        setOpenAlert(true);
        setAlertMessage("Failed to create section");
      }
    } catch (error) {
      console.error("Error during the API call", error);
      //alert("Error during the API call");
      setOpenAlert(true);
      setAlertMessage("Error during the API call");
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      const response = await client.post("api/section/delete/", {
        section_id: sectionId
      });

      if (response.status === 200) {
        const updatedSections = sections.filter(section => section.id !== sectionId);
        setSections(updatedSections);
      } else {
        console.error("Failed to delete section");
        alert("Failed to delete section");
      }
    } catch (error) {
      console.error("Error during the API call", error);
      alert("Error during the API call");
    }
  };

  useEffect(() => {
    if (sectionsContainerRef.current && sectionsContainerRef.current.lastChild) {
      const newSection = sectionsContainerRef.current.lastChild;
      const topPos = newSection.offsetTop + newSection.offsetHeight;
      window.scrollTo({ top: topPos, behavior: 'smooth' });
    }
  }, [sections]);

  if (loading) {
    return (
      <div className="loading-center">
          <MyCircularProgress determinate={false}/>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <MyAlert open={openAlert} setOpen={setOpenAlert} severity={"error"} message={alertMessage} t={t}/>
        <TopBar userData={userData} handleCreateSection={handleCreateSection} setShowSettings={setShowSettings} client={client} t={t}/>
        <AlertDialog open={open} handleClose={handleClose} actionConfirmation={actionConfirmation} type={"Section"} t={t}/>
        <Divider variant="middle" className="main-divider" />
        {/* <Logo /> */}
        <div ref={sectionsContainerRef}> 
          {sections.map((section) => (
            <Section 
              key={section.id}
              sectionId={section.id}
              booksList={section.books}
              name={section.section_name}
              handleDeleteSection={handleActionConfirmation}
              client={client}
              globalLoading={globalLoading}
              setGlobalLoading={setGlobalLoading}
              t={t}
            />
          ))}
        </div>
        <Settings active={showSettings} setActive={setShowSettings}/>
      </div>
    </DndProvider>
  );
}
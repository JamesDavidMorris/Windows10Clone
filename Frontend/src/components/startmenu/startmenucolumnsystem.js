import React, { useEffect, useRef } from 'react';
import {
  icon_system_power,
  icon_system_settings,
  icon_system_pictures,
  icon_system_documents,
  icon_system_profile_default,
  icon_system_burger
} from '../extensions/icons/icons';
import '../../assets/styles/components/startmenu/startmenucolumnsystem.css';

const StartMenuColumnSystem = ({ setIconRefs }) => {
  const burgerRef = useRef(null);
  const profileRef = useRef(null);
  const documentsRef = useRef(null);
  const picturesRef = useRef(null);
  const settingsRef = useRef(null);
  const powerRef = useRef(null);

  useEffect(() => {
    if (setIconRefs) {
      setIconRefs({
        burger: burgerRef.current,
        profile: profileRef.current,
        documents: documentsRef.current,
        pictures: picturesRef.current,
        settings: settingsRef.current,
        power: powerRef.current,
      });
    }
  }, [setIconRefs]);

  return (
    <>
      <div className="top-row">
        <div className="left-column-top">
          <div className="icon-container" ref={burgerRef}>
            <img src={icon_system_burger} alt="Menu" />
          </div>
        </div>
      </div>
      <div className="left-column">
        <div className="left-column-bottom">
          <div className="icon-container" ref={profileRef}>
            <img src={icon_system_profile_default} alt="Profile" />
          </div>
          <div className="icon-container" ref={documentsRef}>
            <img src={icon_system_documents} alt="Documents" />
          </div>
          <div className="icon-container" ref={picturesRef}>
            <img src={icon_system_pictures} alt="Pictures" />
          </div>
          <div className="icon-container" ref={settingsRef}>
            <img src={icon_system_settings} alt="Settings" />
          </div>
          <div className="icon-container" ref={powerRef}>
            <img src={icon_system_power} alt="Power" />
          </div>
        </div>
      </div>
    </>
  );
};

export default StartMenuColumnSystem;

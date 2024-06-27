import React from 'react';
import {
  icon_application_alarm,
  icon_application_calculator,
  icon_application_calendar,
  icon_application_feedback,
  icon_application_fileexplorer,
  icon_application_gethelp,
  icon_application_mail,
  icon_application_microsoftedge,
  icon_application_solitaire,
  icon_application_microsoftstore,
  icon_application_movies,
  icon_application_notepad,
  icon_application_paint,
  icon_application_photos,
  icon_application_windowssettings,
  icon_application_stickynotes,
  icon_application_microsofttips,
  icon_application_weather,
  icon_application_windowssecurity
} from '../extensions/icons/icons';
import '../../assets/styles/components/startmenu/startmenucolumnapplication.css';

const StartMenuColumnApplication = ({ recentlyAddedItems }) => {
  return (
    <div className="recently-added">
      {recentlyAddedItems.map((categoryItem, index) => (
        <div key={index}>
          <div className="category-hover-effect">
            <div className="category-inner">
              {categoryItem.category}
            </div>
          </div>
          {categoryItem.apps.map((app, appIndex) => (
            <div key={appIndex} className="application-hover-effect">
              <div className="application">
                <img src={app.icon} alt={app.name} />
                <span>{app.name}</span>
              </div>
            </div>
          ))}
          <div className="category-spacing"></div> {/* Add this for spacing between categories */}
        </div>
      ))}
    </div>
  );
};

const recentlyAddedItems = [
  { category: 'A', apps: [{ name: 'Alarms & Clock', icon: icon_application_alarm }] },
  { category: 'C', apps: [
    { name: 'Calculator', icon: icon_application_calculator },
    { name: 'Calendar', icon: icon_application_calendar }
  ]},
  { category: 'F', apps: [
    { name: 'Feedback Hub', icon: icon_application_feedback },
    { name: 'File Explorer', icon: icon_application_fileexplorer }
  ]},
  { category: 'G', apps: [{ name: 'Get Help', icon: icon_application_gethelp }] },
  { category: 'M', apps: [
    { name: 'Mail', icon: icon_application_mail },
    { name: 'Microsoft Edge', icon: icon_application_microsoftedge },
    { name: 'Microsoft Solitaire', icon: icon_application_solitaire },
    { name: 'Microsoft Store', icon: icon_application_microsoftstore },
    { name: 'Movies & TV', icon: icon_application_movies }
  ]},
  { category: 'N', apps: [{ name: 'Notepad', icon: icon_application_notepad }] },
  { category: 'P', apps: [
    { name: 'Paint', icon: icon_application_paint },
    { name: 'Photos', icon: icon_application_photos }
  ]},
  { category: 'S', apps: [
    { name: 'Settings', icon: icon_application_windowssettings },
    { name: 'Sticky Notes', icon: icon_application_stickynotes }
  ]},
  { category: 'T', apps: [{ name: 'Tips', icon: icon_application_microsofttips }] },
  { category: 'W', apps: [
    { name: 'Weather', icon: icon_application_weather },
    { name: 'Windows Security', icon: icon_application_windowssecurity }
  ]}
];

export { StartMenuColumnApplication, recentlyAddedItems };

import React from 'react';
import ApplicationFrame from '../../extensions/application/applicationframe';
import ApplicationCalculator from './applicationcalculator';

import iconImage from '../../../assets/images/icons/application/icon_application_calculator_1.png';

const ApplicationFrameCalculator = ({ onClose, ...props }) => {
  console.log('ApplicationFrameCalculator: Component loaded');

  return (
    <ApplicationFrame {...props} onClose={onClose}>
      <ApplicationCalculator />
    </ApplicationFrame>
  );
};

ApplicationFrameCalculator.defaultProps = {
  icon: iconImage,
  title: "Calculator",
  defaultWidth: 300,
  defaultHeight: 540,
  topBarColor: "#e6e6e6",
  backgroundColor: "#e6e6e6",
  // backgroundImage: backgroundImage,
  minimizeButtonColor: "#cfcfcf",
  maximizeButtonColor: "#cfcfcf",
  // closeButtonColor: "#ea1022"
};

export default ApplicationFrameCalculator;

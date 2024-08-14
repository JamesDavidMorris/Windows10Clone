import React from 'react';
import '../../../assets/styles/components/applications/calculator/applicationcalculator.css';

import {
  icon_system_backspace_000000,
  icon_system_burger_000000
} from '../../extensions/icons/icons';

const ApplicationCalculator = () => {
  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <div className="calculator-title-container">
          <img src={icon_system_burger_000000} alt="Menu" className="calculator-menu-icon" />
          <div className="calculator-title">Standard</div>
        </div>
        <div className="calculator-display">0</div>
      </div>
      <div className="calculator-memory-buttons">
        <button className="calculator-button-small memory">MC</button>
        <button className="calculator-button-small memory">MR</button>
        <button className="calculator-button-small memory">M+</button>
        <button className="calculator-button-small memory">M-</button>
        <button className="calculator-button-small memory">MS</button>
        <button className="calculator-button-small memory">M</button>
      </div>
      <div className="calculator-buttons">
        <button className="calculator-button function">%</button>
        <button className="calculator-button function">√</button>
        <button className="calculator-button function">x²</button>
        <button className="calculator-button function">¹/x</button>
        <button className="calculator-button function">CE</button>
        <button className="calculator-button function">C</button>
        <button className="calculator-button function">
          <img src={icon_system_backspace_000000} alt="Backspace" />
        </button>
        <button className="calculator-button operator">÷</button>
        <button className="calculator-button number">7</button>
        <button className="calculator-button number">8</button>
        <button className="calculator-button number">9</button>
        <button className="calculator-button operator">×</button>
        <button className="calculator-button number">4</button>
        <button className="calculator-button number">5</button>
        <button className="calculator-button number">6</button>
        <button className="calculator-button operator">−</button>
        <button className="calculator-button number">1</button>
        <button className="calculator-button number">2</button>
        <button className="calculator-button number">3</button>
        <button className="calculator-button operator">+</button>
        <button className="calculator-button function">±</button>
        <button className="calculator-button number">0</button>
        <button className="calculator-button function bold">.</button>
        <button className="calculator-button operator">=</button>
      </div>
    </div>
  );
};

export default ApplicationCalculator;

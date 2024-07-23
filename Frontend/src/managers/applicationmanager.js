class ApplicationManager {
  constructor() {
    this.applications = [];
    this.listeners = [];
    this.focusListeners = [];
    this.focusedApplication = null;
  }

  getApplications() {
    console.log('ApplicationManager: getApplications called', this.applications);
    return this.applications;
  }

  getFocusedApplication() {
    console.log('ApplicationManager: Focus applications', this.focusedApplication);
    return this.focusedApplication;
  }

  addListener(listener) {
    this.listeners.push(listener);
    console.log('ApplicationManager: Listener added', listener);
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
    console.log('ApplicationManager: Listener removed', listener);
  }

  addFocusListener(listener) {
    this.focusListeners.push(listener);
    console.log('ApplicationManager: Focus listener added', listener);
  }

  removeFocusListener(listener) {
    this.focusListeners = this.focusListeners.filter(l => l !== listener);
    console.log('ApplicationManager: Focus listener removed', listener);
  }

  notifyListeners() {
    console.log('ApplicationManager: Notifying listeners', this.applications);
    this.listeners.forEach(listener => listener([...this.applications]));
  }

  notifyFocusListeners() {
    console.log('ApplicationManager: Notifying focus listeners', this.focusedApplication);
    this.focusListeners.forEach(listener => listener(this.focusedApplication));
  }

  openApplication(app) {
    console.log('ApplicationManager: Opening application', app);
    this.applications.push(app);
    this.notifyListeners();
    this.focusApplication(app.key);
  }

  closeApplication(appKey) {
    console.log('ApplicationManager: Closing application', appKey);
    this.applications = this.applications.filter(app => app.key !== appKey);
    this.notifyListeners();
    this.unfocusApplication();
  }

  focusApplication(appKey) {
    console.log('ApplicationManager: Focusing application', appKey);
    this.focusedApplication = appKey;
    this.notifyFocusListeners();
  }

  unfocusApplication() {
    console.log('ApplicationManager: Unfocusing application', this.focusedApplication);
    this.focusedApplication = null;
    this.notifyFocusListeners();
  }

  isFocused(appKey) {
    return this.focusedApplication === appKey;
  }
}

export default new ApplicationManager();

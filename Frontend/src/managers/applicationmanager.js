class ApplicationManager {
  constructor() {
    this.applications = [];
    this.listeners = [];
    this.focusListeners = [];
    this.focusedApplicationStack = [];
  }

  getApplications() {
    console.log('ApplicationManager: getApplications called', this.applications);
    return this.applications;
  }

  getFocusedApplication() {
    //console.log('ApplicationManager: Focus applications', this.focusedApplicationStack[0] || null);
    return this.focusedApplicationStack[0] || null;
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
    console.log('ApplicationManager: Notifying focus listeners', this.focusedApplicationStack);
    this.focusListeners.forEach(listener => listener([...this.focusedApplicationStack]));
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
    this.focusedApplicationStack = this.focusedApplicationStack.filter(key => key !== appKey);
    this.notifyListeners();
    this.notifyFocusListeners();
  }

  focusApplication(appKey) {
    console.log('ApplicationManager: Focusing application', appKey);
    this.focusedApplicationStack = [appKey, ...this.focusedApplicationStack.filter(key => key !== appKey)];
    this.notifyFocusListeners();
  }

  unfocusApplication() {
    console.log('ApplicationManager: Unfocusing application', this.focusedApplicationStack[0] || null);
    this.focusedApplicationStack.shift();
    this.notifyFocusListeners();
  }

  getZIndex(appKey) {
    const index = this.focusedApplicationStack.indexOf(appKey);
    return index === -1 ? 0 : this.focusedApplicationStack.length - index;
  }

  isFocused(appKey) {
    return this.focusedApplicationStack[0] === appKey;
  }
}

export default new ApplicationManager();

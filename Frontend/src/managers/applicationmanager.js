class ApplicationManager {
  constructor() {
    this.applications = [];
    this.listeners = [];
    this.focusListeners = [];
    this.restoreListeners = [];
    this.focusedApplicationStack = [];
    this.minimizedApplications = new Set();
    this.taskbarPositions = {};
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

  addRestoreListener(listener) {
    this.restoreListeners.push(listener);
    console.log('ApplicationManager: Restore listener added', listener);
  }

  removeRestoreListener(listener) {
    this.restoreListeners = this.restoreListeners.filter(l => l !== listener);
    console.log('ApplicationManager: Restore listener removed', listener);
  }

  notifyListeners() {
    console.log('ApplicationManager: Notifying listeners', this.applications);
    this.listeners.forEach(listener => listener([...this.applications]));
  }

  notifyFocusListeners() {
    console.log('ApplicationManager: Notifying focus listeners', this.focusedApplicationStack);
    this.focusListeners.forEach(listener => listener([...this.focusedApplicationStack]));
  }

  notifyRestoreListeners(appKey) {
    console.log('ApplicationManager: Notifying restore listeners for app', appKey);
    this.restoreListeners.forEach(listener => listener(appKey));
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
    this.focusedApplicationStack = [appKey, ...this.focusedApplicationStack.filter(key => key !== appKey && key !== null)];
    this.notifyFocusListeners();
  }

  unfocusApplication() {
    console.log('ApplicationManager: Unfocusing application', this.focusedApplicationStack[0] || null);
    if (this.focusedApplicationStack.length > 0 && this.focusedApplicationStack[0] !== null) {
      this.focusedApplicationStack = [null, ...this.focusedApplicationStack.filter(key => key !== null)];
      this.notifyFocusListeners();
    }
  }

  minimizeApplication(appKey) {
    console.log('ApplicationManager: Minimizing application', appKey);
    this.minimizedApplications.add(appKey);
    this.unfocusApplication();
    this.notifyListeners();
  }

  restoreApplication(appKey) {
    console.log('ApplicationManager: Restoring application', appKey);
    this.minimizedApplications.delete(appKey);
    this.notifyRestoreListeners(appKey);
    this.focusApplication(appKey);
    this.notifyListeners();
  }

  getZIndex(appKey) {
    const index = this.focusedApplicationStack.indexOf(appKey);
    return index === -1 ? 0 : this.focusedApplicationStack.length - index;
  }

  isFocused(appKey) {
    return this.focusedApplicationStack[0] === appKey;
  }

  updateTaskbarPosition(appKey, position) {
    this.taskbarPositions[appKey] = position;
  }

  getTaskbarPosition(appKey) {
    return this.taskbarPositions[appKey] || { top: 0, left: 0 };
  }
}

export default new ApplicationManager();

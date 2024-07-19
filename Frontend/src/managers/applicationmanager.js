class ApplicationManager {
  constructor() {
    this.applications = [];
    this.listeners = [];
  }

  getApplications() {
    console.log('ApplicationManager: getApplications called', this.applications);
    return this.applications;
  }

  addListener(listener) {
    this.listeners.push(listener);
    console.log('ApplicationManager: Listener added', listener);
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
    console.log('ApplicationManager: Listener removed', listener);
  }

  notifyListeners() {
    console.log('ApplicationManager: Notifying listeners', this.applications);
    this.listeners.forEach(listener => listener(this.applications));
  }

  openApplication(app) {
    console.log('ApplicationManager: Opening application', app);
    this.applications.push(app);
    this.notifyListeners();
  }

  closeApplication(appName) {
    console.log('ApplicationManager: Closing application', appName);
    this.applications = this.applications.filter(app => app.name !== appName);
    this.notifyListeners();
  }
}

export default new ApplicationManager();

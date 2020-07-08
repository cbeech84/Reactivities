import { RootStore } from "./rootStore";
import { observable, action } from "mobx";

export default class ModalStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable.shallow modal = { //we specify shallow on the observable so that mobx is only observing if body changes from null to something else, not all the changes within the body object itself.
    open: false,
    body: null
  }

  @action openModal = (content: any) => {
    this.modal.open = true;
    this.modal.body = content;
  }

  @action closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
  }
}
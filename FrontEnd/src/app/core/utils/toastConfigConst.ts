import { IndividualConfig } from "ngx-toastr";

const toastConfigAddCart: Partial<IndividualConfig> = {
  positionClass: 'toast-top-right',
  closeButton: true,
  timeOut: 3000,
  progressBar: true,
  progressAnimation: 'increasing',
  tapToDismiss: true,
};

import { ComplaintModule } from './complaint.module';

describe('ComplaintModule', () => {
  let complaintModule: ComplaintModule;

  beforeEach(() => {
    complaintModule = new ComplaintModule();
  });

  it('should create an instance', () => {
    expect(complaintModule).toBeTruthy();
  });
});

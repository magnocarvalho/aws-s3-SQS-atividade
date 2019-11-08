/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ImagemService } from './imagem.service';

describe('Service: Imagem', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImagemService]
    });
  });

  it('should ...', inject([ImagemService], (service: ImagemService) => {
    expect(service).toBeTruthy();
  }));
});

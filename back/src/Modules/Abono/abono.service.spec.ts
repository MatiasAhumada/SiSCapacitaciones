import { Test, TestingModule } from '@nestjs/testing';
import { AbonoService } from './abono.service';

describe('AbonoService', () => {
  let service: AbonoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbonoService],
    }).compile();

    service = module.get<AbonoService>(AbonoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

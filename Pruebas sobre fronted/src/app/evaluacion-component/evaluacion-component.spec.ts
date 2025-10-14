import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionComponent } from './evaluacion-component';
import { identifierName } from '@angular/compiler';

describe('EvaluacionComponent', () => {
  let component: EvaluacionComponent;
  let fixture: ComponentFixture<EvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should Prueba con .toEqual', () => {
    component.nombre = "Darwin";
    fixture.detectChanges();
    expect(component.nombre).toEqual('Darwin');
  });

  it('should Prueba con .toBeLessThan', () => {
    component.nota1 = 5;
    component.nota2 = 9;
    fixture.detectChanges();
    expect(component.nota1).toBeLessThan(component.nota2);
  });

  it('should Prueba con .toMatch', () => {
    component.textareaContent = "Universidad de las Fuerzas Armadas ESPE";
    fixture.detectChanges();
    expect(component.textareaContent).toMatch(/Universidad de las Fuerzas Armadas ESPE/);
  });

  it('should Prueba con .toBeTruthy', () => {
    spyOn(component, 'dado').and.returnValue(true);
    expect(component.dado()).toBeTruthy();
  });

  it('should Prueba con .toContain', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Evaluación Segundo Parcial');
  });
});

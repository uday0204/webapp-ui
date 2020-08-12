import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistDailiesComponent } from './playlist-dailies.component';

describe('PlaylistDailiesComponent', () => {
  let component: PlaylistDailiesComponent;
  let fixture: ComponentFixture<PlaylistDailiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistDailiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistDailiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

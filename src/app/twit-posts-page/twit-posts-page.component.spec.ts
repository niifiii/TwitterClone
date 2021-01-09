import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitPostsPageComponent } from './twit-posts-page.component';

describe('TwitPostsPageComponent', () => {
  let component: TwitPostsPageComponent;
  let fixture: ComponentFixture<TwitPostsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwitPostsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitPostsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

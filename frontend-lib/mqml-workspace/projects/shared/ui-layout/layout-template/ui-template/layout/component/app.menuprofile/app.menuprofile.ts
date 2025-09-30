import {Component, computed, effect, ElementRef, inject, OnDestroy, Renderer2} from '@angular/core';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {LayoutService} from '../../service/layout.service';
import {Subscription} from 'rxjs';
import {AppDefaultAuthenticationService, AppSession} from 'mqml-angular-ui-layout-sdk/layout-interface';
import {Avatar} from 'primeng/avatar';
import {NgClass, NgIf} from '@angular/common';
import {Tooltip} from 'primeng/tooltip';



@UntilDestroy()
@Component({
  selector: '[lib-app-menu-profile]',
  imports: [
    Avatar,
    NgClass,
    NgIf,
    Tooltip
  ],
  templateUrl: './app.menuprofile.html',
  standalone: true,
  styleUrl: './app.menuprofile.scss',
  host: {
    class: 'layout-menu-profile'
  }
})
export class AppMenuProfile implements OnDestroy {
  layoutService = inject(LayoutService);

  renderer = inject(Renderer2);

  el = inject(ElementRef);

  isHorizontal = computed(() => this.layoutService.isHorizontal() && this.layoutService.isDesktop());

  menuProfileActive = computed(() => this.layoutService.layoutState().menuProfileActive);

  menuProfilePosition = computed(() => this.layoutService.layoutConfig().menuProfilePosition);

  isTooltipDisabled = computed(() => !this.layoutService.isSlim());

  subscription!: Subscription;

  outsideClickListener: any;

  session?: AppSession;
  constructor(private authenticationService: AppDefaultAuthenticationService) {
    this.authenticationService.getSessionListener()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (session) => this.session = session,
        error: (error) => {
          console.error('Error:', error);
        }
      })

    this.subscription = this.layoutService.overlayOpen$.subscribe(() => {
      if(this.isHorizontal() && this.menuProfileActive()) {
        this.layoutService.layoutState.update(value => ({...value, menuProfileActive: false}))
      }
    })

    effect(() => {
      if(this.isHorizontal() && this.menuProfileActive() && !this.outsideClickListener) {
        this.bindOutsideClickListener();
      }

      if(!this.menuProfileActive() && this.isHorizontal()) {
        this.unbindOutsideClickListener();
      }
    })
  }

  bindOutsideClickListener() {
    if(this.isHorizontal()) {
      this.outsideClickListener = this.renderer.listen(document, 'click', (event: MouseEvent) => {
        if(this.menuProfileActive()) {
          const isOutsideClicked = !(this.el.nativeElement.isSameNode(event.target) || this.el.nativeElement.contains(event.target))
          if(isOutsideClicked) {
            this.layoutService.layoutState.update(value => ({...value, menuProfileActive: false}))
          }
        }
      })
    }
  }

  unbindOutsideClickListener() {
    if(this.outsideClickListener) {
      this.outsideClickListener();
      this.outsideClickListener = null;
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.unbindOutsideClickListener();
  }

  toggleMenu() {
    this.layoutService.onMenuProfileToggle();
  }

  logout(): void {
    this.authenticationService.logout();
  }
}

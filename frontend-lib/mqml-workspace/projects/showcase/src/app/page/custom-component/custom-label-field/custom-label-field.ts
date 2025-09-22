import {Component, Inject, LOCALE_ID} from '@angular/core';
import {LabelFieldExample} from './custom-label-field.model';
import {AppBreadcrumbService, AppNotificationService} from 'mqml-angular-ui-layout-sdk/layout-interface';
import {Panel} from 'primeng/panel';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {AppLabelFieldComponent} from 'mqml-angular-ui-sdk/label-field';
import {PrimeTemplate} from 'primeng/api';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-custom-label-field',
  imports: [
    Panel,
    NgForOf,
    AppLabelFieldComponent,
    NgClass,
    PrimeTemplate,
    NgIf,
    FormsModule
  ],
  templateUrl: './custom-label-field.html',
  styleUrl: './custom-label-field.scss'
})
export class CustomLabelField {
  examples: LabelFieldExample[] = [
    {
      id: 'basic',
      title: 'Basic',
      templates: [
        {
          label: 'Full Name',
          value: {
            type: 'static',
            value: 'John Doe'
          },
        },
        {
          label: 'Date of Birth',
          value: {
            type: 'static',
            value: 'N/A'
          }
        },
        {
          label: 'Sex',
          value: {
            type: 'static',
            value: 'M'
          }
        },
        {
          label: 'Address',
          value: {
            type: 'static',
            value: '201 W. Center St.'
          }
        },
        {
          label: 'City',
          value: {
            type: 'static',
            value: 'Rochester'
          }
        },
        {
          label: 'State',
          value: {
            type: 'static',
            value: 'MN'
          }
        },
        {
          label: 'Zipcode',
          value: {
            type: 'static',
            value: '55902'
          }
        }
      ]
    },
    {
      id: 'form',
      title: 'Form',
      templates: [
        {
          label: 'Full Name',
          value: {
            type: 'input',
            value: 'John Doe'
          },
        },
        {
          label: 'Date of Birth',
          infoTooltip: 'Date format MM/DD/YYYY',
          value: {
            type: 'input',
            value: 'N/A'
          }
        },
        {
          label: 'Sex',
          value: {
            type: 'input',
            value: 'M'
          }
        },
        {
          label: 'Address',
          infoTooltip: 'Physical address',
          value: {
            type: 'input',
            value: '201 W. Center St.'
          }
        },
        {
          label: 'City',
          value: {
            type: 'input',
            value: 'Rochester'
          }
        },
        {
          label: 'State',
          value: {
            type: 'input',
            value: 'MN'
          }
        },
        {
          label: 'Zipcode',
          value: {
            type: 'input',
            value: '55902'
          }
        }
      ]
    },
    {
      id: 'overflow',
      title: 'Overflow',
      templates: [{
        label: 'Long Text',
        value: {
          type: 'static',
          value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed efficitur felis quis nunc ullamcorper, vel luctus est accumsan. Duis commodo ex eget nisi pretium, et maximus mauris ultrices. Mauris consectetur faucibus nibh in porta. Morbi nec finibus risus. Maecenas tincidunt tortor vel vulputate tempus. Donec sit amet commodo odio. Donec et quam tempus, egestas massa et, luctus dolor. Duis sit amet placerat nunc.'
        }
      }]
    },
    {
      id: 'tags',
      title: 'Tags',
      templates: [
        {
          label: 'Password',
          value: {
            type: 'static',
            value: 'John Doe'
          },
          tags: [
            {
              icon: 'fa-solid fa-exclamation',
              severity: 'danger',
              tooltip: 'Invalid password',
              click: () => this.notificationService.error('Invalid password tag was clicked...')
            }
          ]
        },
        {
          label: 'Patient',
          value: {
            type: 'static',
            value: 'John Doe'
          },
          tags: [
            {
              value: 'Clinical',
              tooltip: 'This is a clinical sample',
              click: () => this.notificationService.info('Clinical tag was clicked...')
            },
            {
              value: 'Rush',
              severity: 'danger'
            },
            {
              icon: 'fa-solid fa-copy',
              click: () => this.notificationService.success('Copy successfully')
            }
          ]
        },
        {
          label: 'Address',
          overflowEllipsis: false,
          value: {
            type: 'static',
            value: '201 W. Center St., Rochester MN 55902'
          },
          tags: [
            {
              value: 'Not Verified',
              severity: 'warn',
              tooltip: 'The address has not been verified',
              click: () => this.notificationService.warn('Not verified tag was clicked...')
            }
          ]
        },
      ]
    },
    {
      id: 'info',
      title: 'Info',
      templates: [{
        label: 'Name',
        value: {
          type: 'static',
          value: 'John Doe'
        },
        infoTooltip: 'This is an informational tooltip that can be used to share any information with the users.'
      }]
    },
    {
      id: 'custom-styles',
      title: 'Custom Styles',
      styleClass: 'custom-styles',
      templates: [{
        label: 'Name',
        customToolbar: true,
        value: {
          type: 'static',
          value: 'John Doe'
        }
      }]
    }

  ];

  favorite: boolean = false;


  constructor(private breadcrumbService: AppBreadcrumbService,
              private notificationService: AppNotificationService,
              @Inject(LOCALE_ID) public locale: string) {
  }


  handleCopySuccess(value: string): void {
    this.notificationService.success('Copied to clipboard');
  }

}

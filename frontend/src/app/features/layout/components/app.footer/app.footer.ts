import { Component } from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';

@Component({
  selector: '[app-footer]',
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './app.footer.html',
  styleUrl: './app.footer.scss',
  host:{
    class: 'layout-footer'
  }
})
export class AppFooter {

  //Default year and content if not provided in the configuration
  currentYear = new Date().getFullYear();

  title: string = 'MQML App'

  applicationCI: string = 'ci_mqml_app'

  applicationFooter: {leftContent: string, rightContent: string} = {
    leftContent: `<span> For immediate assistance, call Help Desk (4-5500) and reference ${this.title} (System ID: ${this.applicationCI}). Otherwise, <a target="_new" href="https://mcsm.service-now.com/serviceconnect?id=sc_cat_item_guide&amp;sys_id=5d3aa41387cacd900d4011783cbb359c&amp;sysparm_category=3c0d800bdb0560d49986166e1396190a" class="underline text-blue-600 font-medium">Submit a Ticket</a></span>`,
    rightContent: `© ${new Date().getFullYear()} MQML Foundation for Medical Education and Research. All rights reserved.`
  }

}

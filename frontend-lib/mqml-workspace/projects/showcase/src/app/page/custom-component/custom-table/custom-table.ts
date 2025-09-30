import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TableConfiguration} from './custom-table.models';
import {AppPageRequest} from 'mqml-angular-ui-sdk/api';
import {FilterMetadata, PrimeTemplate} from 'primeng/api';
import {
  AppTableColumnInstance,
  AppTableColumnType,
  AppTableFilterType
} from 'mqml-angular-ui-sdk/table/src/model/app-table-interface';
import {orderBy} from 'lodash-es';
import {SelectButton} from 'primeng/selectbutton';
import {FormsModule} from '@angular/forms';
import {ProgressBar} from 'primeng/progressbar';
import {AppTableComponent} from 'mqml-angular-ui-sdk/table';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [
    SelectButton,
    FormsModule,
    PrimeTemplate,
    ProgressBar,
    AppTableComponent,
  ],
  templateUrl: './custom-table.html',
  styleUrl: './custom-table.scss'
})
export class CustomTable implements OnInit {

  @ViewChild('simpleTable') simpleTable!: AppTableComponent;
  @ViewChild('groupedTable') groupedTable!: AppTableComponent;
  @ViewChild("testColumn") testColumn!: TemplateRef<any>;

  tableConfigurations: { [s: string]: TableConfiguration } = {
    'simpleTable': this.createTableConfiguration(() => this.simpleTable, {
      'orderNumber': [{
        matchMode: 'notEquals',
        value: 12341234
      }]
    }),
    'groupedTable': this.createTableConfiguration(() => this.groupedTable)
  }

  selectButtonOptions = [{ label: 'Active', value: 'active' },{ label: 'Retired', value: 'retired' }];
  selectButtonValue: string = 'active';

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {

  }

  onPageRequest(name: string, pageRequest: AppPageRequest): void {
    this.tableConfigurations[name].loading = true;
    setTimeout(() => {
      this.tableConfigurations[name].records = this.getMockData(pageRequest);
      this.tableConfigurations[name].totalRecords = 100;
      this.tableConfigurations[name].loading = false;
      this.cdr.markForCheck();
    }, 1000);

  }


  private createTableConfiguration(tableProvider: () => AppTableComponent, filters: {
    [s: string]: FilterMetadata | FilterMetadata[];
  } = {}): TableConfiguration {
    return new TableConfiguration({
      filters: filters,
      columns: [
        {
          key: 'menu',
          header: {
            icon: 'fa-solid fa-bars',
          },
          body: {
            type: AppTableColumnType.MENU,
            menuItemProvider: (rowItem: any, rowIndex: number) => {
              return [
                {
                  label: 'Info',
                  icon: 'fa-solid fa-circle-info',
                  iconClass: 'text-blue-500!'
                },
                {
                  label: 'Copy',
                  icon: 'fa-solid fa-copy',
                  iconClass: 'text-orange-500!'
                },
                {
                  separator: true
                },
                {
                  label: 'Sign out',
                  icon: 'fa-regular fa-circle-check',
                  iconClass: 'text-green-500!'
                }
              ]
            }
          }
        },
        {
          key: 'orderNumber',
          header: {
            title: 'Order Number'
          },
          body: {
            type: AppTableColumnType.ROUTE,
            field: 'orderNumber',
            url: '/components/table'
          },
          filter: {
            type: AppTableFilterType.TEXT,
            field: 'orderNumber',
            operator: 'or'
          },
          sort: {
            field: 'orderNumber'
          }
        },
        {
          key: 'testCode',
          header: {
            title: 'Test Code'
          },
          body: {
            type: AppTableColumnType.TEXT,
            field: 'testCode'
          },
          filter: {
            type: AppTableFilterType.MULTISELECT,
            field: 'testCode.id',
            filterOptions: ['NMPAN', 'NGSHM', 'NEUFUS', 'HONCP', 'PNPAN', 'MCOP', 'NGFUS', 'COAGPLTNGS'].map((value, index) => ({
              "label": value,
              "value": index
            })),
            showOperator: false,
            showMatchModes: false,
            showAddButton: false
          },
          sort: {
            field: 'testCode'
          }
        },
        {
          key: 'cost',
          header: {
            title: 'Cost'
          },
          body: {
            type: AppTableColumnType.NUMBER,
            field: 'cost',
            formatStyle: 'currency',
            styleClass: 'text-right'
          },
          filter: {
            type: AppTableFilterType.NUMERIC,
            field: 'cost'
          }
        },
        {
          key: 'gender',
          header: {
            title: 'Gender',
            styleClass: 'text-center'
          },
          body: {
            type: AppTableColumnType.TEXT,
            field: 'gender',
            styleClass: 'text-center'
          },
          sort: {
            field: 'gender'
          },
          reorderable: true
        },
        {
          key: 'createdOn',
          header: {
            title: 'Created'
          },
          body: {
            type: AppTableColumnType.DATE,
            field: 'createdOn'
          },
          filter: {
            type: AppTableFilterType.DATE,
            field: 'createdOn'
          }
        },
        {
          key: 'templateColumn',
          header: {
            title: 'Activity'
          },
          body: {
            type: AppTableColumnType.TEMPLATE,
            templateProvider: () => this.testColumn,
            styleClass: 'text-center'
          },
          reorderable: true
        }, {
          key: 'testTags',
          header: {
            title: 'Tags'
          },
          body: {
            type: AppTableColumnType.TAG,
            tagProvider: () => {
              const otherTagValues = ['Rush', 'Hold', 'Blocked'];
              const tagValues = ['Clinical', 'Research', 'Development'];
              return [{
                value: tagValues[Math.floor(Math.random() * tagValues.length)]
              }, {
                value: otherTagValues[Math.floor(Math.random() * tagValues.length)],
                severity: 'warn'
              }]
            }
          }
        },
        {
          key: 'report',
          header: {
            title: 'Report',
            styleClass: 'text-center'
          },
          body: {
            type: AppTableColumnType.CHECKBOX,
            field: 'active',
            styleClass: 'text-center',
            click: (item: any, column: AppTableColumnInstance, rowIndex: number) => {
              column.loading = true;
              setTimeout(() => {
                item.active = !item.active;
                tableProvider().setItem(rowIndex, item);
                column.loading = false;
              }, 2000);
            }
          },
          reorderable: false
        }
      ],
      defaultColumns: [
        {
          key: 'menu',
          reorderable: false,
          body: {
            type: AppTableColumnType.MENU,
            menuItemProvider: (rowItem: any, rowIndex: number) => {
              return [
                {
                  label: 'Info',
                  icon: 'fa-solid fa-circle-info',
                  iconClass: 'text-blue-500!'
                },
                {
                  label: 'Copy',
                  icon: 'fa-solid fa-copy',
                  iconClass: 'text-orange-500!'
                },
                {
                  separator: true
                },
                {
                  label: 'Sign out',
                  icon: 'fa-regular fa-circle-check',
                  iconClass: 'text-green-500!'
                }
              ]
            }
          }
        },
        {
          key: 'orderNumber',
          header: {
            title: 'Order Number'
          },
          body: {
            type: AppTableColumnType.ROUTE,
            field: 'orderNumber',
            url: '/components/table'
          },
          filter: {
            type: AppTableFilterType.TEXT,
            field: 'orderNumber',
            operator: 'or'
          },
          sort: {
            field: 'orderNumber'
          }
        },
        {
          key: 'testCode',
          header: {
            title: 'Test Code'
          },
          body: {
            type: AppTableColumnType.TEXT,
            field: 'testCode'
          },
          filter: {
            type: AppTableFilterType.MULTISELECT,
            field: 'testCode.id',
            filterOptions: ['NMPAN', 'NGSHM', 'NEUFUS', 'HONCP', 'PNPAN', 'MCOP', 'NGFUS', 'COAGPLTNGS'].map((value, index) => ({
              "label": value,
              "value": index
            })),
            showOperator: false,
            showMatchModes: false,
            showAddButton: false
          },
          sort: {
            field: 'testCode'
          }
        },
        {
          key: 'cost',
          header: {
            title: 'Cost'
          },
          body: {
            type: AppTableColumnType.NUMBER,
            field: 'cost',
            formatStyle: 'currency',
            styleClass: 'text-right'
          },
          filter: {
            type: AppTableFilterType.NUMERIC,
            field: 'cost'
          }
        },
        {
          key: 'gender',
          header: {
            title: 'Gender',
            styleClass: 'text-center'
          },
          body: {
            type: AppTableColumnType.TEXT,
            field: 'gender',
            styleClass: 'text-center'
          },
          sort: {
            field: 'gender'
          },
          reorderable: true
        },
        {
          key: 'createdOn',
          header: {
            title: 'Created'
          },
          body: {
            type: AppTableColumnType.DATE,
            field: 'createdOn'
          },
          filter: {
            type: AppTableFilterType.DATE,
            field: 'createdOn'
          }
        },
        {
          key: 'templateColumn',
          header: {
            title: 'Activity'
          },
          body: {
            type: AppTableColumnType.TEMPLATE,
            templateProvider: () => this.testColumn,
            styleClass: 'text-center'
          },
          reorderable: true
        }, {
          key: 'testTags',
          header: {
            title: 'Tags'
          },
          body: {
            type: AppTableColumnType.TAG,
            tagProvider: () => {
              const otherTagValues = ['Rush', 'Hold', 'Blocked'];
              const tagValues = ['Clinical', 'Research', 'Development'];
              return [{
                value: tagValues[Math.floor(Math.random() * tagValues.length)]
              }, {
                value: otherTagValues[Math.floor(Math.random() * tagValues.length)],
                severity: 'warn'
              }]
            }
          }
        },
        {
          key: 'report',
          reorderable: false,
          header: {
            title: 'Report',
            styleClass: 'text-center'
          },
          body: {
            type: AppTableColumnType.CHECKBOX,
            field: 'active',
            styleClass: 'text-center',
            click: (item: any, column: AppTableColumnInstance, rowIndex: number) => {
              column.loading = true;
              setTimeout(() => {
                item.active = !item.active;
                tableProvider().setItem(rowIndex, item);
                column.loading = false;
              }, 2000);
            }
          }
        }
      ]
    });
  }


  private getMockData(pageRequest: AppPageRequest): any[] {
    const orderNumbers = ['0012345', '123453', '78123883', '8372628', '02893728'];
    const testCodes = ['EPPAN', 'IEMCP', 'NGSHM', 'NEUFUS', 'NEUMUT'];
    const statuses = ['Open', 'Released', 'Analysis', 'Review', 'Consulting'];
    const genders = ['M', 'F'];
    const softLabOrders = ['S12345', 'S93920', 'S192930', 'S390203', 'S034928']
    const mockDataList = Array(pageRequest.limit).fill(0)
      .map(() => {
        return {
          orderNumber: orderNumbers[Math.floor(Math.random() * orderNumbers.length)],
          testCode: testCodes[Math.floor(Math.random() * testCodes.length)],
          orderNumberSoftLab: softLabOrders[Math.floor(Math.random() * softLabOrders.length)],
          gender: genders[Math.floor(Math.random() * genders.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          active: true,
          createdOn: new Date(),
          cost: Math.floor(Math.random() * 3000),
          activityPercentage: Math.floor(Math.random() * 99)
        }
      });
    if (pageRequest.sort?.length) {
      const sortFieldList: string[] = [];
      const sortDirectionList: Array<boolean | 'asc' | 'desc'> = [];
      pageRequest.sort.forEach(sort => {
        const sortSplit = sort.split(" ").filter(value => value.length);
        let direction: 'asc' | 'desc' = 'asc';
        if (sortSplit.length > 1) {
          direction = sortSplit[1] === 'desc' ? 'desc' : 'asc';
        }
        sortFieldList.push(sortSplit[0]);
        sortDirectionList.push(direction);
      })
      return orderBy(mockDataList, sortFieldList, sortDirectionList);
    }
    return mockDataList;
  }


}

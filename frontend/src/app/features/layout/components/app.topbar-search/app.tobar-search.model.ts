import {MenuItem} from 'primeng/api';
import {Observable} from 'rxjs';

export interface AppSearchMenuItem {
  id: string;
  label: string;
  icon?: string;
  searchParam: string;
  searchMatchMode: string;
}

export interface AppSearchMenu {
  selectedIndex: number;
  menuItems: AppSearchMenuItem[];
  onSearch(searchTerm: string, menuItem: MenuItem): Observable<void>;
}

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatRippleModule} from '@angular/material/core';

@Component({
  selector: 'app-tag-filter',
  imports: [FormsModule, NgClass, MatIconModule, MatRippleModule],
  templateUrl: './tag-filter.html',
  styleUrl: './tag-filter.scss'
})
export class TagFilter {
  @Input() availableTags: string[] = [];
  @Output() filterChanged = new EventEmitter<{ search: string; tags: string[] }>();

  selectedTags = new Set<string>();
  search = '';


  toggleTag(tag: string) {
    if (this.selectedTags.has(tag)) {
      this.selectedTags.delete(tag);
    } else {
      this.selectedTags.add(tag);
    }
    this.emitChanges();
  }

  emitChanges() {
    this.filterChanged.emit({
      search: this.search.toLowerCase(),
      tags: Array.from(this.selectedTags)
    });
  }

  public applyFilter<T>(entries: T[], tagBody: (i: T) => string[], searchBody: (i: T) => string) {

    return entries.filter((entry) => {
      const searchable: string = searchBody(entry);
      const matchesSearch = !this.search || searchable.startsWith(this.search);
      const tags: string[] = tagBody(entry);

      const matchesTags = tags.length === 0 || this.every(tags);
      return matchesSearch && matchesTags;
    });
  }

  private every(tags: string[]) {
    let res: boolean = true;
    for (const x of this.selectedTags) {
      res = tags.includes(x);
      if(res) continue;
      return false;
    }
    return res;
  }

  protected clearFilter() {
    this.selectedTags.clear();
    this.search = '';
    this.emitChanges();
  }
}

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input, NgZone,
  OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, FormsModule} from '@angular/forms';
import {Editor, RawEditorOptions} from 'tinymce';
import {AppSafeHtmlPipe, AppStyle, AppUser} from 'mqml-angular-ui-sdk/api';
import {EditorComponent} from '@tinymce/tinymce-angular';
import {AppEditorValueChangeEvent} from '../model/app-editor.interface';
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import {Tag} from 'primeng/tag';
import {NgClass, NgForOf, NgIf} from '@angular/common';


@UntilDestroy()
@Component({
  selector: 'lib-app-editor',
  imports: [
    Tag,
    NgIf,
    NgClass,
    EditorComponent,
    AppSafeHtmlPipe,
    FormsModule,
    NgForOf
  ],
  templateUrl: './app-editor.component.html',
  styleUrl: './app-editor.component.scss'
})
export class AppEditorComponent implements OnChanges, ControlValueAccessor, OnInit, AfterViewInit {
  @Input() init: RawEditorOptions | undefined;
  @Input() enableMentions: boolean = false;
  @Input() mentionColor: string = "#D83B01";
  @Input() mentionLoading: boolean = false;
  @Input() menubar: any = 'file edit view insert format';
  @Input() placeholder?: string;
  @Input() previewMode: boolean = false;
  @Input() previewLabel: string | undefined;
  @Input() readOnly: boolean = false;
  @Input() ready: boolean = true;
  @Input() style: AppStyle;
  @Input() styleClass: string | undefined;
  @Input() template: string | undefined;
  @Input() toolbar: any = 'bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link';
  @Input() toolbarLocation: 'top' | 'bottom' | 'auto' = 'top';
  @Input() value: string | undefined;
  @Output() valueChange: EventEmitter<string> = new EventEmitter();
  @Output() mentionSearch = new EventEmitter<string>();
  @Output() mentionsChanged = new EventEmitter<AppUser[]>();
  @Output() onValueChange: EventEmitter<AppEditorValueChangeEvent> = new EventEmitter();
  @Output() onKeyUp: EventEmitter<KeyboardEvent> = new EventEmitter();
  @Output() onKeyDown: EventEmitter<KeyboardEvent> = new EventEmitter();
  @Output() onKeyPress: EventEmitter<KeyboardEvent> = new EventEmitter();
  @Output() onBlur: EventEmitter<FocusEvent> = new EventEmitter();
  @ViewChild("editor") editor!: EditorComponent;
  @ViewChild(EditorComponent, {read: ElementRef}) editorElRef!: ElementRef;

  mentionPopupVisible = false;
  popupX = 0;
  popupY = 0;
  editorInstance: any;
  mentionedUsernames: AppUser[] = [];
  mentionQuery = '';
  protected previewEnabled: boolean = false;
  protected lastMentionRange: Range | null = null;
  private initialized: boolean = false;
  protected internalSettings: RawEditorOptions = {
    base_url: '/tinymce',
    browser_spellcheck: true,
    content_style: this.getStyle(),
    contextmenu: false,
    convert_urls: false,
    menubar: this.menubar,
    plugins: 'advlist autolink lists link charmap preview code',
    promotion: false,
    statusbar: false,
    placeholder: this.placeholder,
    suffix: '.min',
    toolbar: this.toolbar,
    height: '100%',
    init_instance_callback: () => {
      this.initialized = true;
    },
    verify_html: false
  }
  private mentionStartContainer: Node | null = null;
  private mentionStartOffset: number = 0;

  constructor(private readonly elementRef: ElementRef, private zone: NgZone) {
  }

  @Input() set mentionUserSuggestions(value: AppUser[]) {
    this._mentionUsers = value.sort((a: AppUser, b: AppUser) => (a?.fullName ?? '') < (b?.fullName ?? '') ? -1 : 1);
  }

  protected _mentionUsers: AppUser[] = [];

  get mentionUsers(): AppUser[] {
    return this._mentionUsers;
  }

  get settings(): RawEditorOptions {
    return this.internalSettings;
  }

  getStyle(): string {
    return  `
            body {
              font: 10pt/1 Helvetica, Arial, "Trebuchet MS", "Liberation Sans", FreeSans, sans-serif;
            }
            .mentionName {
              color: ${this.mentionColor};
              font-weight: bold;
            }
          `;
  }

  ngOnChanges(changes: SimpleChanges): void {

    // if(changes['init']){
    //     if(this.init){
    //         this.settings = Object.assign({}, this.settings, this.init);
    //     }
    // }

    if (changes['placeholder']) {
      this.settings.placeholder = this.placeholder;
    }

    if (changes['toolbarLocation']) {
      this.settings.toolbar_location = this.toolbarLocation;
    }

    if (changes['toolbar']) {
      this.settings.toolbar = this.toolbar;
    }

    if (changes['menubar']) {
      this.settings.menubar = this.menubar;
    }

    if (changes['readOnly']) {
      this.toggleEditorReadOnly();
    }

    if (changes['previewMode']) {
      this.previewEnabled = this.previewMode;
      this.toggleEditorReadOnly();
    }
    if (changes['mentionColor']) {
      this.settings.content_style = this.getStyle();
    }
  }

  ngOnInit(): void {
    const userSetup = this.init?.setup;
    const userInitCallback = this.init?.init_instance_callback;

    this.internalSettings = {
      ...this.internalSettings,
      ...this.init,
      setup: (editor: Editor) => {
        if (this.enableMentions) {
          this.setupMentionDetection(editor);
        }
        if (userSetup) userSetup(editor);
      },
      init_instance_callback: (editor) => {
        this.editorInstance = editor;
        if (userInitCallback) userInitCallback(editor);
        this.initialized = true;
      }
    };
  }

  ngAfterViewInit(): void {
    this.toggleEditorReadOnly();
    if (!this.previewMode || !this.previewEnabled) {
      this.editor.onInit
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this.editor.editor?.contentDocument?.addEventListener('click', event => this.bubbleClickEvent(event));
          this.editor.editor?.editorContainer?.addEventListener('click', event => this.bubbleClickEvent(event));
        });
    }
  }

  /**
   * This method is called when the value has changed from the p-editor component.
   * @param newValue
   */
  _handleOnChangeValue(newValue: string): void {
    if (this.initialized) {
      this.value = newValue;
      this._onChange(newValue);
      this.valueChange.emit(newValue);
      const htmlValue: string = this.editor.editor.getContent({format: 'html'});
      const textValue: string = this.editor.editor.getContent({format: 'text'});
      this.onValueChange.emit({html: htmlValue, text: textValue});
      this.emitMentionsFromContent();
    }
  }

  _handleOnKeyUp(event: KeyboardEvent): void {
    this.onKeyUp.emit(event);
  }

  _handleOnKeyDown(event: KeyboardEvent): void {
    this.onKeyDown.emit(event);
  }

  _handleOnKeyPress(event: KeyboardEvent): void {
    this.onKeyPress.emit(event);
  }

  _handleOnBlur(event: FocusEvent): void {
    this.onBlur.emit(event);
    this._onTouched();
  }

  /**
   * When a form value changes due to user input, we need to report the value
   * back to the parent form. This is done by calling a callback, that was initially
   * registered with the control using the registerOnChange method.
   * @param onChange
   */
  registerOnChange(onChange: any): void {
    this._onChange = onChange;
  }

  /**
   * When the user first interacts with the form control, the control is considered
   * to have the status touched, which is useful for styling. In order to report to
   * the parent form that the control was touched, we need to use a callback registered
   * using the registerOnTouched method.
   * @param onTouched
   */
  registerOnTouched(onTouched: any): void {
    this._onTouched = onTouched;
  }

  /**
   * This method is called by the Forms module to write a value into a form control
   * @param value
   */
  writeValue(value: string): void {
    this.value = value;
    if (this.editor?.editor) {
      this.editor.editor.setContent(value || '');
    }
  }

  insertMention(user: any, event: MouseEvent) {

    event.preventDefault();
    event.stopImmediatePropagation();


    if (!this.editorInstance || !this.mentionStartContainer) return;
    const range = this.editorInstance.selection.getRng();

    const newNode = document.createElement('span');
    newNode.className = 'mention';
    newNode.innerHTML = `<span class="mentionName">@${user.fullName}</span>&nbsp;`;

    const newRange = document.createRange();
    newRange.setStart(this.mentionStartContainer, this.mentionStartOffset);
    newRange.setEnd(range.startContainer, range.startOffset);
    newRange.deleteContents();
    newRange.insertNode(newNode);

    this.editorInstance.selection.select(newNode, false);
    this.editorInstance.selection.collapse(false);

    // Record and sync changes
    const updatedContent = this.editorInstance.getContent({ format: 'html' });
    this._handleOnChangeValue(updatedContent); // Notify Angular

    this.mentionPopupVisible = false;
    this.mentionQuery = '';
    this.mentionedUsernames.push(user.fullName);
    this.emitMentionsFromContent();
  }

  protected _onChange = (value: any) => {
  };

  protected _onTouched = () => {
  };

  protected enableEditMode(): void {
    if (this.readOnly) {
      return;
    }
    this.previewEnabled = false;
    if (!this.value && this.template) {
      this.value = this.template;
    }
    this.initEditor();
  }

  private initEditor(): void {
    if (!this.editor) {
      setTimeout(() => this.initEditor(), 100);
      return;
    }
    // Make sure the proper tinymce mode is initialized when loaded.
    this.toggleEditorReadOnly();
    this.editor.onInit
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.editor.editor?.contentDocument?.addEventListener('click', (event: MouseEvent) => this.bubbleClickEvent(event));
        this.editor.editor?.editorContainer?.addEventListener('click', (event: MouseEvent) => this.bubbleClickEvent(event));
      });
    this.initFocus();
  }

  private initFocus(): void {
    if (!this.editor?.editor?.initialized) {
      setTimeout(() => this.initFocus(), 100);
      return;
    }
    this.editor.editor.focus();
  }

  /**
   * Propagate click event to its container
   * @param event MouseEvent
   */
  private bubbleClickEvent(event: MouseEvent): void {
    this.elementRef.nativeElement.dispatchEvent(new Event(event.type, {
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      composed: event.composed
    }));
  }

  private toggleEditorReadOnly() {
    if (this.editor?.editor) {
      const editor = this.editor.editor;
      if (this.readOnly || this.previewEnabled) {
        editor.mode.set('readonly');
      } else {
        editor.mode.set('design');
      }
    } else {
      this.settings.readonly = this.readOnly || this.previewEnabled;
    }
  }

  private setupMentionDetection(editor: Editor) {
    editor.on('keyup', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.mentionPopupVisible) {
        e.preventDefault();
        this.mentionPopupVisible = false;
        return;
      }

      const rng = editor.selection.getRng();
      const node = rng.startContainer;
      const offset = rng.startOffset;
      const textBefore = node.textContent?.substring(0, offset) ?? '';
      const match = /(?:^|\s)@(\w*)$/.exec(textBefore);

      if (match) {
        this.mentionQuery = match[1];
        this.mentionStartContainer = node;
        this.lastMentionRange = rng;
        this.mentionStartOffset = offset - match[1].length - 1; // -1 to account for the '@' character
        this.zone.run(() => {
          this.mentionSearch.emit(this.mentionQuery);
          this.showMentionPopup();
        });
      } else {
        this.closeMentionPopup(e);
      }
    });

    editor.on('click', (event: MouseEvent) => {
      if (this.mentionPopupVisible) {
        this.closeMentionPopup(event);
      }
    });

    editor.on('ScrollContent', (event) => {
      if (this.mentionPopupVisible) {
        this.closeMentionPopup(event);
      }
    });

    document.addEventListener('click', (event: MouseEvent) => {
      if (this.mentionPopupVisible) {
        this.closeMentionPopup(event);
      }
    });
  }

  private emitMentionsFromContent() {
    const doc = this.editorInstance?.getDoc();
    if (!doc) return;
    const mentions = Array.from(doc.querySelectorAll('.mentionName'))
      .map(el => (el as HTMLElement).textContent?.replace(/^@/, '').trim())
      .filter(Boolean);
    this.mentionedUsernames = this.mentionUsers.filter(user => mentions.includes(user.fullName));
    this.mentionsChanged.emit(this.mentionedUsernames);
  }

  private showMentionPopup() {
    const rect = this.lastMentionRange?.getBoundingClientRect();
    const container = this.editorElRef?.nativeElement?.querySelector('iframe');
    if (rect && container) {
      const scrollTop = container.contentWindow?.scrollY || 0;
      this.popupX = rect.left + 5;
      this.popupY = rect.top + scrollTop;
    }
    this.mentionPopupVisible = true;
  }

  private closeMentionPopup(event?: Event) {
    this.zone.run(() => {
      if (!event || !this.editorElRef.nativeElement.contains(event.target)) {
        this.mentionPopupVisible = false;
      }
    });
  }

}

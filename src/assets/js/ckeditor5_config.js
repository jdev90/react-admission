import {
    AccessibilityHelp,
    Autoformat,
    AutoImage,
    Autosave,
    BlockQuote,
    Bold,
    Code,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    GeneralHtmlSupport,
    Heading,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    SelectAll,
    SimpleUploadAdapter,
    SourceEditing,
    Strikethrough,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    TodoList,
    Underline,
    Undo
} from 'ckeditor5';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { SERVER_URL } from 'context/config'

// 업로드 어댑터 클래스 정의
class MyUploadAdapter {
    constructor(loader, menuCd) {
        this.loader = loader;
        this.menuCd = menuCd;
    }

    upload() {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            this.loader.file
                .then(file => {
                    data.append('file', file);
                    data.append('MENU_CD', this.menuCd);
                    return fetch(SERVER_URL +'/api/attach/imageUpload', {
                        method: 'POST',
                        body: data,
                    });
                })
                .then(response => {
                    if (!response.ok) {
                        return reject(response.statusText);
                    }
                    return response.json();
                })
                .then(result => {
                    resolve({
                        default: result.url, // 서버에서 반환한 이미지 URL
                    });
                })
                .catch(reject);
        });
    }

    abort() {
        // 필요시 구현
    }
}

// 업로드 어댑터 사용
// const uploadAdapter = (loader) => {
//     return new MyUploadAdapter(loader);
// };
const uploadAdapterPlugin = (editor) => {
    const menuCd = editor.config.get( 'menuCd' );
    //console.log("menuCd", menuCd);
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => new MyUploadAdapter(loader, menuCd);
};
export const editorConfig = {
    enterMode: 2,
    shiftEnterMode: 1,
    htmlSupport: {
        allow: [{name: /.*/,
            attributes: true,
            classes: true,
            styles: true }
        ],
        disallow: [ /* HTML features to disallow */ ]
        },
    toolbar: {
        items: [
            'undo', 'redo', '|', 'sourceEditing', 'findAndReplace', '|',
            'heading', '|', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
            'bold', 'italic', 'underline', 'strikethrough', 'code', '|',
            'link', 'insertImage', 'mediaEmbed', 'insertTable', 'blockQuote', '|',
            'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
        ],
        shouldNotGroupWhenFull: false
    },
    image: {
        toolbar: [
            'imageStyle:alignLeft',
            'imageStyle:alignCenter',
            'imageStyle:alignRight',
            '|',
            'imageResize'
        ],
        resizeOptions: [
            { name: 'imageResize:original', value: null, label: 'Original' },
            { name: 'imageResize:50', value: '50', label: '50%' },
            { name: 'imageResize:75', value: '75', label: '75%' }
        ]
    },
    onReady: (editor) => {
        /*
        // 1. 모델에서 button을 허용
        editor.model.schema.register('button', {
            allowWhere: '$block',
            allowContentOf: '$block',
            isObject: true,
            isLimit: true,
            isConsumable: true
        });

        // 2. Upcast: HTML에서 모델로 변환
        editor.conversion.for('upcast').elementToElement({
            model: 'button',
            view: 'button'
        });

        // 3. Downcast: 모델에서 HTML로 변환
        editor.conversion.for('downcast').elementToElement({
            model: 'button',  // 모델에서의 요소 이름
            view: (modelElement, viewWriter) => {
                // 버튼의 데이터 속성 및 기타 속성 변환
                return viewWriter.createContainerElement('button', {
                    class: modelElement.getAttribute('class'),
                    'data-button-type': modelElement.getAttribute('data-button-type'),
                    'contenteditable': modelElement.getAttribute('contenteditable')
                });
            }
        });
*/
        // 4. 데이터 변경 시 버튼 크기 및 기타 속성 설정
        editor.model.document.on('change:data', () => {

            const images = editor.model.document.getRoot().getChildren().filter(child => child.is('image'));

            images.forEach(image => {
                editor.model.change(writer => {
                    // 이미지 태그에 리사이즈 적용
                    const imgElement = image.getChild(0);
                    writer.setAttribute('width', '75%', imgElement);
                    writer.setAttribute('height', 'auto', imgElement);
                });
            });
/*
            const buttons = editor.model.document.getRoot().getChildren().filter(child => child.is('button'));
            buttons.forEach(button => {
                editor.model.change(writer => {
                    // 버튼에 추가적인 속성 설정이 필요하면 여기에 추가
                    writer.setAttribute('style', 'border: 1px solid #ccc;', button);
                });
            });*/
        });
    },
    enterMode: CKEditor.ENTER_BR,
    // simpleUpload: {
    //     uploadUrl: SERVER_URL +'/api/attach/imageUpload',
    // },
    plugins: [
        AccessibilityHelp,
        Autoformat,
        AutoImage,
        Autosave,
        BlockQuote,
        Bold,
        Code,
        Essentials,
        FindAndReplace,
        FontBackgroundColor,
        FontColor,
        FontFamily,
        FontSize,
        GeneralHtmlSupport,
        Heading,
        ImageBlock,
        ImageCaption,
        ImageInline,
        ImageInsert,
        ImageInsertViaUrl,
        ImageResize,
        ImageStyle,
        ImageTextAlternative,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        Link,
        LinkImage,
        List,
        ListProperties,
        MediaEmbed,
        Paragraph,
        PasteFromOffice,
        SelectAll,
        SimpleUploadAdapter,
        SourceEditing,
        Strikethrough,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        TextTransformation,
        TodoList,
        Underline,
        Undo
    ],
    extraPlugins: [uploadAdapterPlugin],
};
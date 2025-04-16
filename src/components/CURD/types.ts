import type {
  DialogProps,
  DrawerProps,
  FormItemRule,
  FormProps,
  PaginationProps,
  TableProps,
  ColProps,
  ButtonType,
  CardProps,
} from "element-plus";
import type PageContent from "./PageContent.vue";
import type PageForm from "./PageForm.vue";
import type PageModal from "./PageModal.vue";
import type PageSearch from "./PageSearch.vue";
import { CSSProperties } from "vue";

export type PageSearchInstance = InstanceType<typeof PageSearch>;
export type PageContentInstance = InstanceType<typeof PageContent>;
export type PageModalInstance = InstanceType<typeof PageModal>;
export type PageFormInstance = InstanceType<typeof PageForm>;

export type IObject = Record<string, any>;

export interface IOperatData {
  name: string;
  row: IObject;
  column: IObject;
  $index: number;
}

export type ComponentType =
  | "input"
  | "select"
  | "input-number"
  | "date-picker"
  | "time-picker"
  | "time-select"
  | "tree-select"
  | "input-tag"
  | "custom-tag"
  | "cascader";

export interface ISearchConfig {
  // 页面名称(参与组成权限标识,如sys:user:xxx),不填则不进行权限校验
  pageName?: string;
  // 标签冒号(默认：false)
  colon?: boolean;
  // 表单项(默认：[])
  formItems?: Array<{
    // 组件类型(如input,select等)
    type?: ComponentType;
    // 标签文本
    label?: string;
    // 标签提示
    tips?: string | IObject;
    // 键名
    prop: string;
    // 组件属性(input-tag组件支持join,btnText,size属性)
    attrs?: IObject;
    // 初始值
    initialValue?: any;
    // 可选项(适用于select组件)
    options?: Array<{ label: string; value: any }>;
    // 组件事件
    events?: Record<string, (...args: any[]) => void>;
    // 初始化数据函数扩展
    initFn?: (formItem: IObject) => void;
  }>;
  // 是否开启展开和收缩(默认：true)
  isExpandable?: boolean;
  // 默认展示的表单项数量(默认：3)
  showNumber?: number;
  // 卡片属性
  cardAttrs?: Partial<CardProps> & { style?: CSSProperties };
  // form组件属性
  form?: IForm;
  // 自适应网格布局(使用时表单不要添加 style: { width: "200px" })
  grid?: boolean | "left" | "right";
}

export interface IContentConfig<T = any> {
  // 页面名称(参与组成权限标识,如sys:user:xxx)
  pageName: string;
  // table组件属性
  table?: Omit<TableProps<any>, "data">;
  // 分页组件位置(默认：left)
  pagePosition?: "left" | "right";
  // pagination组件属性
  pagination?:
    | boolean
    | Partial<
        Omit<
          PaginationProps,
          "v-model:page-size" | "v-model:current-page" | "total" | "currentPage"
        >
      >;
  // 列表的网络请求函数(需返回promise)
  indexAction: (queryParams: T) => Promise<any>;
  // 默认的分页相关的请求参数
  request?: {
    pageName: string;
    limitName: string;
  };
  // 数据格式解析的回调函数
  parseData?: (res: any) => {
    total: number;
    list: IObject[];
    [key: string]: any;
  };
  // 修改属性的网络请求函数(需返回promise)
  modifyAction?: (data: {
    [key: string]: any;
    field: string;
    value: boolean | string | number;
  }) => Promise<any>;
  // 删除的网络请求函数(需返回promise)
  deleteAction?: (ids: string) => Promise<any>;
  // 后端导出的网络请求函数(需返回promise)
  exportAction?: (queryParams: T) => Promise<any>;
  // 前端全量导出的网络请求函数(需返回promise)
  exportsAction?: (queryParams: T) => Promise<IObject[]>;
  // 导入模板
  importTemplate?: string | (() => Promise<any>);
  // 后端导入的网络请求函数(需返回promise)
  importAction?: (file: File) => Promise<any>;
  // 前端导入的网络请求函数(需返回promise)
  importsAction?: (data: IObject[]) => Promise<any>;
  // 主键名(默认为id)
  pk?: string;
  // 表格工具栏(默认支持add,delete,export,也可自定义)
  toolbar?: Array<
    | "add"
    | "delete"
    | "import"
    | "export"
    | {
        auth: string;
        icon?: string;
        name: string;
        text: string;
        type?: ButtonType;
      }
  >;
  // 表格工具栏右侧图标
  defaultToolbar?: Array<
    | "refresh"
    | "filter"
    | "imports"
    | "exports"
    | "search"
    | {
        name: string;
        icon: string;
        title?: string;
        auth?: string;
      }
  >;
  // table组件列属性(额外的属性templet,operat,slotName)
  cols: Array<{
    type?: "default" | "selection" | "index" | "expand";
    label?: string;
    prop?: string;
    width?: string | number;
    align?: "left" | "center" | "right";
    columnKey?: string;
    reserveSelection?: boolean;
    // 列是否显示
    show?: boolean;
    // 模板
    templet?:
      | "image"
      | "list"
      | "url"
      | "switch"
      | "input"
      | "price"
      | "percent"
      | "icon"
      | "date"
      | "tool"
      | "custom";
    // image模板相关参数
    imageWidth?: number;
    imageHeight?: number;
    // list模板相关参数
    selectList?: IObject;
    // switch模板相关参数
    activeValue?: boolean | string | number;
    inactiveValue?: boolean | string | number;
    activeText?: string;
    inactiveText?: string;
    // input模板相关参数
    inputType?: string;
    // price模板相关参数
    priceFormat?: string;
    // date模板相关参数
    dateFormat?: string;
    // tool模板相关参数
    operat?: Array<
      | "edit"
      | "delete"
      | {
          auth?: string;
          icon?: string;
          name: string;
          text: string;
          type?: ButtonType;
          render?: (row: IObject) => boolean;
        }
    >;
    // filter值拼接符
    filterJoin?: string;
    [key: string]: any;
    // 初始化数据函数
    initFn?: (item: IObject) => void;
  }>;
}

export interface IModalConfig<T = any> {
  // 页面名称
  pageName?: string;
  // 主键名(主要用于编辑数据,默认为id)
  pk?: string;
  // 组件类型
  component?: "dialog" | "drawer";
  // dialog组件属性
  dialog?: Partial<Omit<DialogProps, "modelValue">>;
  // drawer组件属性
  drawer?: Partial<Omit<DrawerProps, "modelValue">>;
  // form组件属性
  form?: IForm;
  // 表单项
  formItems: IFormItems<T>;
  // 提交之前处理
  beforeSubmit?: (data: T) => void;
  // 提交的网络请求函数(需返回promise)
  formAction: (data: T) => Promise<any>;
}

export type IForm = Partial<Omit<FormProps, "model" | "rules">>;

// 表单项
export type IFormItems<T = any> = Array<{
  // 组件类型(如input,select,radio,custom等，默认input)
  type?:
    | "input"
    | "select"
    | "radio"
    | "switch"
    | "checkbox"
    | "tree-select"
    | "date-picker"
    | "input-number"
    | "text"
    | "custom";
  // 组件属性
  attrs?: IObject;
  // 组件可选项(适用于select,radio,checkbox组件)
  options?: Array<{
    label: string;
    value: any;
    disabled?: boolean;
    [key: string]: any;
  }>;
  // 插槽名(适用于组件类型为custom)
  slotName?: string;
  // 标签文本
  label: string;
  // 标签提示
  tips?: string;
  // 键名
  prop: string;
  // 验证规则
  rules?: FormItemRule[];
  // 初始值
  initialValue?: any;
  // 是否隐藏
  hidden?: boolean;
  // layout组件Col属性
  col?: Partial<ColProps>;
  // 监听函数
  watch?: (newValue: any, oldValue: any, data: T, items: IObject[]) => void;
  // 计算属性函数
  computed?: (data: T) => any;
  // 监听收集函数
  watchEffect?: (data: T) => void;
  // 初始化数据函数扩展
  initFn?: (item: IObject) => void;
}>;

export interface IPageForm {
  // 主键名(主要用于编辑数据,默认为id)
  pk?: string;
  // form组件属性
  form?: IForm;
  // 表单项
  formItems: IFormItems;
}

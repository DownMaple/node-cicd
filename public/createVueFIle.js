
// 1. 创建一个新的 Vue SFC 文件
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from "node:url"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const folderPath = path.resolve(__dirname, '../outPut')
export default function createVueFile(sqlData,fileName) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    sqlData.forEach(item => {
      item.COLUMN_NAME = item.COLUMN_NAME.replace(/_([a-z])/g, function(match, p1) {
        return p1.toUpperCase();
      })
    })
    try {
      const newFile = path.join(folderPath, `${fileName}.vue`);
      let formData = ``
      let tableColumns = ``
      let typeData = ``
      let formEditMsg = ``
      let drawerForm = ``
      sqlData.forEach((item) => {
        drawerForm += `data.${item.COLUMN_NAME} = '';`
        typeData += `${item.COLUMN_NAME}:${item.DATA_TYPE},`
        formEditMsg += `drawerForm.${item.COLUMN_NAME} = data.${item.COLUMN_NAME};`
        tableColumns += ` { label: '${item.COLUMN_COMMENT}', key: '${item.COLUMN_NAME}', align: 'center' },`
          if(item.DATA_TYPE == 'varchar') {
            formData +=`
                <el-form-item label="${item.COLUMN_COMMENT}" label-width="120px" prop="${item.COLUMN_NAME}">
                  <el-input v-model="drawerForm.${item.COLUMN_NAME}" autocomplete="off" placeholder="请输入${item.COLUMN_COMMENT}" />
                </el-form-item>
            `
        } else if (item.DATA_TYPE == 'int' || item.DATA_TYPE == 'tinyint' || item.DATA_TYPE =='smallint') {
            formData +=`
              <el-form-item label="${item.COLUMN_COMMENT}" label-width="120px" prop="${item.COLUMN_NAME}">
              <el-input
                type="number"
                v-model="drawerForm.${item.COLUMN_NAME}"
                autocomplete="off"
                placeholder="请输入${item.COLUMN_COMMENT}"
              />
            </el-form-item>
          `
        } else if (item.DATA_TYPE == 'datetime') {
            formData +=`
               <el-form-item label="${item.COLUMN_COMMENT}" label-width="120px" prop="${item.COLUMN_NAME}">
                <el-date-picker
                  type="datetime"
                  v-model="drawerForm.${item.COLUMN_NAME}"
                  placeholder="请选择${item.COLUMN_COMMENT}"
                />
          </el-form-item>
          `
        } else if (item.DATA_TYPE == 'text') {
            formData +=`
                <el-form-item label="${item.COLUMN_COMMENT}" label-width="120px" prop="${item.COLUMN_NAME}">
                  <wang-editor v-model="drawerForm.${item.COLUMN_NAME}" />
                </el-form-item>
          `
        }
      })
      // // 2. 写入文件内容
      const fileContent = `
        <template>
           <div class="component-box component-box-flex">
    <my-table-page
        ref="myTablePageRef"
        :data="tableData"
        :init="init"
        v-model:page="page"
        :options="tableOptions"
        @add-massage="addMessage"
    >
      <template #operate="{ rowData, index }">
        <el-button link type="primary" icon="Edit" @click="editMsg(rowData)">编辑</el-button>
        <el-popconfirm title="是否删除该${fileName}?" @confirm="deleteArticle(rowData, index)">
          <template #reference>
            <el-button link type="primary" icon="Delete">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </my-table-page>
    <!--    新增、编辑 弹出 start-->
    <el-drawer
        v-model="drawerState"
        :title="formState ? '新增${fileName}' : '编辑${fileName}'"
        destroy-on-close
        :before-close="handleClose"
        size="50%"
    >
      <template #default>
        <el-form :model="drawerForm" ref="drawerFormRef" :rules="drawerFormRules">
            ${formData}
        </el-form>
      </template>
      <template #footer>
        <div class="drawer-foot-btnGroup">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="confirmClick(drawerFormRules)">保存</el-button>
        </div>
      </template>
    </el-drawer>
    <!--    新增、编辑 弹出 end-->
  </div>
        </template>

        <script setup lang="ts">
        import { onMounted, provide, reactive, ref } from 'vue'
import { addArticleAPI, deleteArticleAPI, getACList, getArticleAPI, updateArticleAPI } from '@/api/content/article.ts'
import { showError, showSuccess, showWarn } from '@/utils/toast.ts'
import { ElMessageBox, FormInstance, FormRules } from 'element-plus'
import UploadPhoto from '@/components/system/uploadPhoto.vue'
import { clearObject, initCascader, printTable, toTreeList } from '@/utils'
import WangEditor from '@/components/myForm/WangEditor.vue'
import MyTablePage from '@/components/myTable/myTablePage.vue'

const tableOptions = ref<TableOptionsType>({
  btnGroup: ['add'],
  searchItems: [
    { label: '文章标题', value: 'title', labelWidth: 70, col: 5 },
  ],
  tableColumns: [
    { label: '序号', type: 'index', align: 'center', width: 80 },
    ${tableColumns}
    { label: '操作', slot: 'operate', align: 'center', fixed: 'right', width: 240 }
  ]
})
const page = ref<TablePageType>({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 20, 30, 40, 50, 100],
  LastPageNum: 1,
  LastPageSize: 10
})
const search = ref({
  title: '',
  classId: '',
  startTime: '',
  endTime: ''
})
provide('searchForm', search)
const myTablePageRef = ref()

type ${fileName} {
      ${typeData}
}

const classifyDataList = ref<${fileName}[]>([])
const classifyData = ref<${fileName}[]>([])
const tableData = ref<${fileName}[]>([])

const formState = ref(false)

// 添加新的文章弹出事件
function addMessage() {
  clearObject(drawerForm)
  formState.value = true
  drawerState.value = true
}


// 编辑文章
function editMsg(data: ${fileName}) {
          ${formEditMsg}
  formState.value = false
  drawerState.value = true
}

// 删除文章
async function deleteArticle(data: ${fileName}, index: number) {
  const { data: res } = await deleteArticleAPI(data.id)
  if (res.code == 200) {
    showSuccess('成功删除${fileName}：' + data.title)
    tableData.value.splice(index, 1)
  } else {
    showError(res.message)
  }
}

const drawerState = ref(false)
const drawerFormRef = ref()
const drawerForm = reactive<${fileName}>({
      ${drawerForm}
})
const drawerFormRules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 2, max: 30, message: '请正确填写2-30个字符', trigger: 'blur' }
  ],
})

function handleClose(done: () => void) {
  if (articleForm.state == 0) {
    ElMessageBox.confirm('改动数据可能未保存，确定要关闭编辑窗口吗?')
        .then(() => {
          done()
        })
        .catch(() => {
          // catch error
        })
  }
}

function cancelClick() {
  drawerState.value = false
}

async function confirmClick(formEl: FormInstance | undefined) {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      let res
      if (formState.value) {
        res = await addArticleAPI(drawerForm)
      } else {
        res = await updateArticleAPI(drawerForm)
      }
      if (res?.data.code == 200) {
        showSuccess('操作成功')
        drawerState.value = false
        tableData.value = []
        await init()
      }
    }
  })
}


async function init() {
  const { data: res } = await getArticleAPI(
      search.value.title,
      page.value.pageNum,
      page.value.pageSize
  )
  if (res.code == 200) {
    page.value.total = res.data.totalCount
    tableData.value = res.data.list
    page.value.LastPageNum = page.value.pageNum
    page.value.LastPageSize = page.value.pageSize
  } else {
    page.value.pageNum = page.value.LastPageNum
    page.value.pageSize = page.value.LastPageSize
    myTablePageRef.value.currentPage = page.value.LastPageNum
    myTablePageRef.value.pageSize = page.value.LastPageNum
  }
}

onMounted(() => {
  init()
})

        </script>

        <style lang="scss" scoped>
          /* 在此处插入你的样式 */
        </style>`
      
      fs.writeFileSync(newFile, fileContent)
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })

}

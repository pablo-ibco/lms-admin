<template>
  <div class="content-box mt-3">
    <div class="resume-box w-100 d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center">
        <span class="three-points mr-2"></span>
        <span :class="types[mediaContent.type].classIco"></span>
        <h6 class="d-inline-block mb-0 ml-2">
          {{types[mediaContent.type].label + (taskName[mediaContent.contentType] ? (' - ' + taskName[mediaContent.contentType]) :  '')}}
        </h6>
      </div>

      <div class="d-flex align-items-center">
        <span @click="$emit('remove-item', mediaContent.id)" class="cursor-pointer trash-ico mr-4"></span>
        <a href="#" @click="showModule = !showModule"><img src="../../assets/img/utils/ico-arrow-dropdown.svg"></a>
      </div>
    </div>

    <div class="expanded-box pb-3" v-show="showModule">
      <div style="margin-top: 16px; gap: 16px" class="d-flex w-100 justify-content-between pl-3 pr-3">
        <div class="w-100" v-if="['text', 'incorporate'].includes(mediaContent.type)">
          <label class="d-block">
            {{ mediaContent.type === 'incorporate' ? 'Insira o código que deseja incorporar' : 'Texto' }}
          </label>
          <b-form-textarea v-model="model.text" rows="6" @change="updateAttr"
                           :placeholder='mediaContent.type === "incorporate" ? "<embed type=\"image/jpg\" src=\"pic_trulli.jpg\" width=\"300\" height=\"200\"" : "Insira o texto que fará parte da sua aula"'>
          </b-form-textarea>

          <a href="https://rockcontent.com/br/blog/embed-code-o-que-e/" target="_blank" v-if="mediaContent.type === 'incorporate'"
             class="mt-3 d-block purple-link">Não sabe o que são links incorporados?</a>
        </div>

        <div class="w-100" v-else-if="['audio', 'file'].includes(mediaContent.type)">
          <div class="file-select">
            <div class="audio-play" v-if="mediaContent.type === 'audio' && audio">
              <audio controls class="w-100">
                <source :src="model.content.base64" type="audio/mpeg">
              </audio>
            </div>

            <div v-else-if="mediaContent.type === 'file' && file">
              <label class="d-block mt-3">Título do arquivo</label>
              <div class="d-flex w-100">
                <b-form-group class="mb-0 w-100">
                  <b-form-input v-model="model.name" class="input-border" type="text" @change="updateAttr"
                                placeholder="Insira o título do seu arquivo"/>
                </b-form-group>
                <button class="btn btn-transparent cursor-pointer"><i class="black-eye-ico"></i></button>
              </div>
            </div>

            <div v-else class="drop-area" @click="$refs.fileInput.click()" v-cloak @drop.prevent="loadFile"
                 @dragover.prevent>
              <input class="d-none" ref="fileInput" type="file" enctype="multipart/form-data" @change="loadFile"
                     :accept="mediaContent.type === 'audio' ? 'audio/*' : '*/*'">
              <div class="w-100 text-center">
                <img height="auto" width="48px" :class="{'mic-ico': mediaContent.type === 'audio', 'file-ico': mediaContent.type === 'file'}">
                <div class="mt-2">Arraste ou <u>selecione</u> um arquivo {{ mediaContent.type === 'audio' ? "de aúdio" : "" }}</div>
              </div>
            </div>

          </div>

          <div class="mt-3">
            <b-form-checkbox class="checkbox-style" v-model="model.enableDownload" :value="true"
                             @change="updateAttr">Permitir download
            </b-form-checkbox>
          </div>
        </div>

        <div class="w-100" v-else-if="mediaContent.type === 'video'">
          <label class="d-block">Insira o link para vídeo do Youtube ou Vimeo</label>
          <b-form-group>
            <b-form-input v-model="model.link" class="input-border" type="url" @change="updateAttr"
                          placeholder="www.youtube.com"/>
          </b-form-group>
          <div class="mt-3">
            <b-form-checkbox class="checkbox-style" v-model="model.hasDRM" :value="true" @change="updateAttr">
              Incluir DRM nesse vídeo. <i class="help-circle-ico ml-2" v-b-tooltip.hover="{customClass: 'tooltip-box' }"
                                          :title="drmMessage"></i>
            </b-form-checkbox>

            <b-tooltip target="my-button" custom-class="my-tooltip-class">Tooltip Title</b-tooltip>
          </div>
        </div>

        <div class="w-100" v-else-if="mediaContent.type === 'task'">
          <div class="w-100" v-if="!model.contentType">
            <label class="d-block">Escolha o tipo de atividade que deseja criar:</label>
            <div class="d-flex justify-content-between w-100 task-types">
              <span class="t-multiple-choice" @click="selectTypeQuestion('multiple-choice')">Múltiplas opções</span>
              <span class="t-checkbox" @click="selectTypeQuestion('checkbox')">Caixas de seleção</span>
              <span class="t-true-false" @click="selectTypeQuestion('true-or-false')">Verdadeiro ou falso</span>
              <span class="t-short-answer" @click="selectTypeQuestion('short-answer')">Resposta curta</span>
            </div>
          </div>

          <div v-else>
            <b-form-group class="mb-0 w-100">
              <b-form-input v-model="model.title" class="input-border" type="text" @change="updateAttr"
                            placeholder="Insira o enunciado da sua atividade"/>
            </b-form-group>

            <div class="options" v-if="['multiple-choice', 'true-or-false'].includes(model.contentType)">
              <div class="w-100 mt-3 mb-3 text-right" v-if="model.contentType.includes('multiple-choice')">
                <a href="#" class="d-block purple-link cursor-pointer" @click="addOption('radio')">Criar alternativa</a>
              </div>

              <draggable v-model="model.options" class="mt-3" draggable=".radio-option-task" @change="reorderValues">
                <transition-group>
                  <div class="w-100 radio-option-task pl-3" v-for="(option, index) in model.options"
                       :key="index">
                    <b-form-group class="checkbox-style mt-2" style="width: 530px">
                      <b-form-radio-group name="options" v-model="model.rightAnswer">
                        <b-form-radio :value="index">
                          <b-form-textarea v-model="option.text" placeholder="Insira a descrição dessa opção"
                                           rows="1" max-rows="6" style="height: 36px" @change="updateAttr"
                                           :disabled="model.contentType.includes('true-or-false')"></b-form-textarea>
                        </b-form-radio>

                      </b-form-radio-group>
                    </b-form-group>
                    <div class="actions-task">
                      <button class="btn btn-rounded-purple trash" v-b-tooltip="'Remover'" v-if="model.type.includes('multiple-choice')"
                              @click="actionTask('remove', index)"></button>
                      <button class="btn btn-rounded-purple ml-2 check" v-b-tooltip="'Marcar como correta'"
                              @click="actionTask('setCorrect', index)"></button>
                    </div>
                  </div>
                </transition-group>
              </draggable>

              <div class="text-center w-100 pt-4 text-center" v-if="model.options.length > 0">
                <button class="btn btn-purple" @click="previewTask">Pre-visualização</button>
              </div>
            </div>

            <div class="options" v-else-if="model.contentType.includes('checkbox')">
              <div class="w-100 mt-3 mb-3 text-right">
                <a class="d-block purple-link cursor-pointer" @click="addOption('checkbox')">Criar alternativa</a>
              </div>

              <draggable v-model="model.options" draggable=".radio-option-task" @change="reorderValues">
                <transition-group>
                  <div class="w-100 mt-2 radio-option-task pl-3" v-for="(option, index) in model.options"
                       :key="index">
                    <b-form-group class="checkbox-style" style="width: 530px">
                      <b-form-checkbox :name="'opt_'+nameOpt" :id="'opt_'+nameOpt" v-model="model.rightAnswer" :key="index" :value="index">
                        <b-form-textarea v-model="option.text" placeholder="Insira a descrição dessa opção"
                                         rows="1" max-rows="6" style="height: 36px"></b-form-textarea>
                      </b-form-checkbox>
                    </b-form-group>

                    <div class="actions-task">
                      <button class="btn btn-rounded-purple trash" v-b-tooltip="'Remover'"
                              @click="actionTask('remove', index)"></button>
                      <button class="btn btn-rounded-purple ml-2 check" v-b-tooltip="'Marcar como correta'"
                              @click="setAnswerCheckbox(option, index)"></button>
                    </div>
                  </div>
                </transition-group>
              </draggable>

              <div class="text-center w-100 pt-4 text-center" v-if="model.options.length > 0">
                <button class="btn btn-purple" @click="previewTask">Pre-visualização</button>
              </div>
            </div>

            <div class="options d-flex w-100 align-items-center" v-else-if="model.contentType.includes('short-answer')">
              <span class="d-inline pencil-ico ml-2 mr-3 align-middle"></span>
              <b-form-group class="mb-0 w-100 mt-3">
                <b-form-textarea v-model="model.options[0].value" placeholder="Insira a resposta da questão"
                                 rows="4" max-rows="6" @change="updateAttr"></b-form-textarea>
              </b-form-group>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="taskView.type">
      <ModalPreviewTask :task="taskView"/>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },
  props: {
    mediaContent: {type: Object},
  },
  computed: {
    model(){
      return this.mediaContent
    }
  },
  data() {
    return {
      types: {
        text: {classIco: 'fonts-purple-ico', label: 'Texto'},
        audio: {classIco: 'mic-purple-ico', label: 'Áudio'},
        video: {classIco: 'video-purple-ico', label: 'Vídeo'},
        file: {classIco: 'file-purple-ico', label: 'Arquivo'},
        incorporate: {classIco: 'incorporate-purple-ico', label: 'Incorporar'},
        task: {classIco: 'task-purple-ico', label: 'Atividade'}
      },
      drmMessage: 'O DRM (Gerenciamento dos Direitos Digitais) protege o seu conteúdo ao acrescentar imagens em posições variadas do vídeo, dificultando o plágio.',
      hasDownload: false,
      showModule: false,
      show: false,
      selectedTask: null,
      audio: null,
      file: null,
      taskView: {},
      taskName: {
        'multiple-choice': 'Múltipla escolha',
        'checkbox': 'Seleção Múltipla',
        'true-or-false': 'Verdadeiro ou falso',
        'short-answer': 'Resposta curta'
      },
      nameOpt: new Date().getTime()
    }
  },
  methods: {
    loadFile(e) {
      const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

      this.$toBase64(file).then(resp => {
        if (this.mediaContent.type === 'audio') {
          this.audio = resp;
        } else if (this.mediaContent.type === 'file') {
          this.file = resp;
        }
        this.model.content = {base64: resp, file: file};
      })

      this.updateAttr();
    },
    updateAttr() {
      if (this.model.id) {
        this.model.id = this.mediaContent.id;
      }

      if (isNaN(this.model.id)) {
        this.model.modified = true;
      }

      this.model.type ||= this.mediaContent.type;
      this.$emit('update-item', {collection: this.type, item: {...this.model}})
    },
    addOption() {
      let option = {
        text: null,
        value: this.model.options.length,
        isCorrect: false,
      };
      this.model.options.push(option);
      this.updateAttr();
    },
    actionTask(action, index) {
      switch (action) {
        case 'setCorrect':
          this.model.options.forEach((option, idx) => {
            option.isCorrect = index === idx;
          })
          this.model.rightAnswer = index;
          break;
        case 'remove':
          this.model.options.splice(index, 1)
          break;
      }
      this.updateAttr();
    },
    setAnswerCheckbox(option, index) {
      if (this.model.rightAnswer.includes(index)) {
        this.model.rightAnswer.splice(this.model.rightAnswer.indexOf(index), 1);
        option.isCorrect = false;
      } else {
        this.model.rightAnswer.push(index)
        option.isCorrect = true;
      }
      this.updateAttr();
    },
    reorderValues() {
      if (this.model.contentType.includes('checkbox')) {
        this.model.rightAnswer = [];
        this.model.options.forEach((option, index) => {
          if (option.isCorrect) {
            this.model.rightAnswer.push(index);
          }
        })
      } else {
        this.model.rightAnswer = this.model.options.findIndex(option => {
          return option.isCorrect
        })
      }
      this.updateAttr();
    },
    previewTask() {
      this.taskView = {};
      this.taskView = this.model;

      setTimeout(() => {
        this.$bvModal.show('preview-question');
      }, 250)
    },
    selectTypeQuestion(type) {
      this.model.contentType = type;

      if (type.includes('true-or-false')) {
        this.model.options = [
          {
            text: 'Verdadeiro',
            value: 'Verdadeiro',
            isCorrect: false
          },
          {
            text: 'Falso',
            value: 'Falso',
            isCorrect: false
          }];
      } else if (['checkbox', 'multiple-choice'].includes(type)) {
        this.model.rightAnswer = [];
        this.model.options = [];
      } else if (type.includes('short-answer')) {
        this.model.options = [{
          text: null,
          value: null,
          isCorrect: true
        }];
      }
      this.updateAttr();
    },
    async getFile(url) {
      const archive = await this.$getFileAWS(url);

      if (this.mediaContent.type === 'audio') {
        this.audio = archive;
      } else if (this.mediaContent.type === 'file') {
        this.file = archive;
      }
    }
  },
  mounted() {
      if(["audio","file"].includes(this.mediaContent.type)){
        if(this.mediaContent.content.file){
          this.$toBase64(this.mediaContent.content.file).then(resp => {
            if (this.mediaContent.type === 'audio') {
              this.audio = resp;
            } else if (this.mediaContent.type === 'file') {
              this.file = resp;
            }
            this.model.content = {base64: resp, file: file};
          })
        }
        else if(this.mediaContent.content.url){
          this.getFile(this.mediaContent.content.url);
        }
      }
  }
}
</script>

<style scoped>
.content-box {
  display: block;
  background: #FFFFFF;
  border: 1px solid #F2F2F2;
  border-radius: 8px;
}

.resume-box {
  padding: 20px 21.5px;
}

.drop-area {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  border: 2px dashed #CDCDCE;
  background: #FBFBFB;
  border-radius: 8px;
  font-size: 14px;
  color: #A7A7AB;
}

u, .purple-link {
  text-decoration: none;
  color: #89238A;
}

.task-types > span {
  position: relative;
  display: inline-flex;
  padding: 12px 16px 12px 32px;
  border: 1px solid #8A8C92;
  border-radius: 8px;
  color: #8A8C92;
  cursor: pointer;
}

.task-types > span:hover {
  color: #89238A;
  border-color: #89238A;
}

.task-types .t-multiple-choice:before {
  position: absolute;
  width: 12px;
  height: 12px;
  top: calc(50% - 6px);
  left: 13px;
  content: '';
  background-image: url("../../assets/img/utils/ico-verify.svg");
  background-size: 12px 12px;
}

.task-types .t-checkbox:before {
  position: absolute;
  width: 12px;
  height: 12px;
  top: calc(50% - 6px);
  left: 13px;
  content: '';
  background-image: url("../../assets/img/utils/ico-check.svg");
  background-size: 12px 12px;
}

.task-types .t-true-false:before {
  position: absolute;
  width: 12px;
  height: 12px;
  top: calc(50% - 6px);
  left: 13px;
  content: '';
  background-image: url("../../assets/img/utils/ico-radio-btn.svg");
  background-size: 12px 12px;
}

.task-types .t-short-answer:before {
  position: absolute;
  width: 12px;
  height: 12px;
  top: calc(50% - 6px);
  left: 13px;
  content: '';
  background-image: url("../../assets/img/utils/ico-pencil-purple.svg");
  background-size: 12px 12px;
}

.radio-option-task {
  position: relative;
  height: 40px;
}

.radio-option-task:before {
  position: absolute;
  width: 10px;
  height: 100%;
  background: url("../../assets/img/utils/three-points-vertical.svg") no-repeat 50%;
  background-size: 5px;
  left: 4px;
  content: '';
}

.radio-option-task .actions-task {
  display: none;
  position: absolute;
  height: 30px;
  right: 0px;
  top: 0px;
  transition: all .2s;
}

.radio-option-task:hover .actions-task {
  display: flex;
  width: 75px;
  align-items: center;
  height: 35px;
}

.radio-option-task:hover .actions-task button.trash {
  padding: 0px 14px;
  background: url("../../assets/img/utils/ico-trash-purple.svg") no-repeat 50%;
  background-size: 16px;
  height: 30px;
}

.radio-option-task:hover .actions-task button.check {
  padding: 0px 14px;
  background: url("../../assets/img/utils/ico-verify.svg") no-repeat 50%;
  background-size: 16px;
  height: 30px;
}

.radio-option-task:hover .actions-task button:hover {
  background-color: #fef0ff;
}

</style>

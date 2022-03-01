<template>
  <div class="form-addCurso">
    <div :class="['main-form', {'course-module': step === 3 && position > 1}]">
      <header>
        <div v-if="!(step === 3 && position > 1)">
          <h4 v-html="headerText[step - 1].title"></h4>
          <span class="sub-text-form" v-html="headerText[step - 1].subtitle"></span>
        </div>
        <div v-else>
          <MenuNavigator @change-position="changePosition" :items="itemsNavigator" :current="position"/>
        </div>
      </header>

      <div class="content-addCurso-form overflow-hidden">
        <div class="h-100 position-relative">
          <div class="group-inputs-carousel" v-if="step === 1">
            <div :class="['input-step-group', {'active': position === 1}]" v-if="position <= 1">
              <div class="item-form">
                <label class="d-block">Como seu curso será chamado?</label>
                <b-form-group>
                  <b-form-input v-model="course.title" class="input-border" type="text" @keyup="validate(course.title)"
                                placeholder="Tran Mau Tri Tam"/>
                </b-form-group>
              </div>
              <div class="pl-3">
                <button class="btn d-inline btn-purple pl-4 pr-4 mt-4" @click="nextPosition" :disabled="!course.title">
                  Ok
                </button>
              </div>
            </div>

            <div :class="['input-step-group', {'active': position === 2}]" v-if="position <= 2">
              <div class="item-form">
                <label class="d-block">Em qual categoria ele se encaixa?</label>
                <FormSelectSearch :items="categoriesList" type="categories" @return-selection="setProperty"/>

              </div>
              <div class="pl-3">
                <button class="btn d-inline btn-purple pl-4 pr-4 mt-4" @click="nextPosition"
                        :disabled="course.categories.length === 0">Ok
                </button>
              </div>
            </div>

            <div :class="['input-step-group', {'active': position === 3}]" v-if="position <= 3">
              <div class="item-form">
                <label class="d-block">Quem criou esse curso?</label>
                <FormSelectSearch :items="authorList" type="authors" @return-selection="setProperty"/>

              </div>
              <div class="pl-3">
                <button class="btn d-inline btn-purple pl-4 pr-4 mt-4" @click="nextPosition"
                        :disabled="course.authors.length === 0">Ok
                </button>
              </div>
            </div>

            <div :class="['input-step-group', {'active': position === 4}]" v-if="position <= 4">
              <div class="item-form">
                <label class="d-block">Qual o tipo de acesso desse curso?</label>
                <b-form-group class="radio-style">
                  <b-form-radio value="PAGO" v-model="course.accessType"
                                @change="validate(course.accessType)"><strong>Pago -</strong> é necessário o pagamento
                    para liberar
                    acesso
                  </b-form-radio>
                  <b-form-radio value="GRATIS" v-model="course.accessType"
                                @change="validate(course.accessType)"><strong>Gratuito -</strong> é necessário apenas o
                    cadastro para
                    liberar acesso
                  </b-form-radio>
                </b-form-group>

              </div>
              <div class="pl-3">
                <button class="btn d-inline btn-purple pl-4 pr-4 mt-4" @click="nextPosition"
                        :disabled="!course.accessType">Ok
                </button>
              </div>
            </div>

            <div :class="['input-step-group', {'active': position === 5}]"
                 v-if="position <= 5">
              <div class="item-form d-inline-flex" style="gap: 16px">
                <UtilsDropImage @send-image="setImage" :image="coverImage.base64"/>
                <div class="box-info-image">
                  <h6 class="grey-neutral-6">Escolha a imagem de capa do seu curso</h6>
                  <span class="d-block grey-neutral">
                    Essa será imagem aparecerá como capa no catálogo de cursos. <br><br><br>
                    Use uma imagem de alta qualidade, em formato vertical e com <strong>dimensão mínima de 300x400 pixels</strong> para garantir uma boa visualização.
                  </span>
                </div>

              </div>
              <div class="pl-3">
                <button class="btn d-inline btn-purple pl-4 pr-4 mt-4" @click="nextPosition"
                        :disabled="!coverImage.base64">Ok
                </button>
              </div>
            </div>
          </div>

          <div class="group-inputs-carousel" v-if="step === 2">
            <div :class="['input-step-group', {'active': position === 1}]" v-if="position <= 1">
              <div class="item-form">
                <label class="d-block">O curso possui alguma Central de Ajuda ou página de Suporte?</label>
                <b-form-group>
                  <b-form-input v-model="course.supportPage" class="input-border" type="text"
                                placeholder="Insira o link da página de ajuda"/>
                </b-form-group>
                <label class="d-block mt-2">Se não houver, você pode pular essa etapa.</label>
              </div>
              <div class="pl-3">
                <button class="btn d-inline btn-purple pl-4 pr-4 mt-4" @click="nextPosition">Ok
                </button>
              </div>
            </div>

            <div :class="['input-step-group', {'active': position === 2}]" v-if="position <= 2">
              <div class="item-form">
                <label class="d-block">No seu curso, os alunos podem:</label>
                <b-form-group class="checkbox-style">
                  <b-form-checkbox-group v-model="permissions" :options="permissionOptions"></b-form-checkbox-group>

                  <label class="d-block" v-if="course.issueCertificate">Quanto precisa ser concluído para emissão do
                    certificado?</label>
                  <b-form-group v-if="permissions.includes('issueCertificate')">
                    <b-form-input v-model="course.certificateIssuePercentage" class="input-border" type="text"
                                  @keyup="validate(course.certificateIssuePercentage)"
                                  placeholder="Insira uma porcentagem"/>
                  </b-form-group>
                </b-form-group>
              </div>
              <div class="pl-3">
                <button class="btn d-inline btn-purple pl-4 pr-4 mt-4" @click="nextPosition"
                        :disabled="permissions.length === 0">Ok
                </button>
              </div>
            </div>

            <div :class="['input-step-group', {'active': position === 3}]" v-if="position <= 3">
              <div class="item-form">
                <label class="d-block">Esse curso possui termos e condições?</label>
                <b-form-group class="radio-style">
                  <b-form-radio value="N" v-model="term" @change="validate(term)">
                    <strong>Não</strong>, não precisa de Termos e Condições
                  </b-form-radio>
                  <b-form-radio value="Y" v-model="term" @change="validate(term)">
                    <strong>Sim</strong>, precisa de Termos e Condições
                  </b-form-radio>
                </b-form-group>

                <b-form-textarea v-if="term === 'Y'" v-model="course.termsAndConditions" rows="6"
                                 @keyup="validate(course.termsAndConditions)"
                                 placeholder="Insira seus Termos e Condições">
                </b-form-textarea>
              </div>
              <div class="pl-3">
                <button class="btn d-inline btn-purple pl-4 pr-4 mt-4" @click="nextPosition"
                        :disabled="!term || (term === 'Y' && !course.termsAndConditions)">Ok
                </button>
              </div>
            </div>
          </div>

          <div class="group-inputs-carousel group-module" v-if="step === 3">
            <div :class="['input-step-group', {'active': position === 1}]" v-if="position <= 1">
              <div class="item-form">
                <button class="btn btn btn-block btn-rounded-purple" @click="nextPosition">+ Criar módulo</button>
                <draggable draggable=".item">
                  <CourseModule v-for="(mdl, idx) in moduleList" :moduleData="mdl" class="item" @open-class="getClass"
                                @add-lesson="openFormLesson" @edit-module="editModule" :key="idx"
                                @remove-class="removeClass"/>
                </draggable>
              </div>
            </div>

            <div :class="['input-step-group', {'active': position === 2}]" v-if="position <= 2">
              <div class="item-form">

                <label class="d-block">Título do módulo</label>
                <b-form-group>
                  <b-form-input v-model="module.title" class="input-border" type="text"
                                placeholder="Insira o título do seu módulo" @change="validateModule"/>
                </b-form-group>

                <label class="d-block mt-4">Quando será disponibilizado?</label>
                <b-form-group class="radio-style">
                  <b-form-radio value="immediate" v-model="availabilityModule" @change="validateModule">
                    Imediatamente, assim que o curso for publicado.
                  </b-form-radio>

                  <b-form-radio value="registration" v-model="availabilityModule" @change="validateModule">
                    De acordo com a matrícula do aluno.
                  </b-form-radio>
                  <span v-if="availabilityModule === 'registration'">
                    <label class="d-block">Quantos dias após a matrícula?</label>
                    <b-form-group>
                      <b-form-input v-model="module.releaseDaysAfterPurchase" class="input-border" type="number"
                                    placeholder="Insira a quantidade de dias" @change="validateModule"/>
                    </b-form-group>
                  </span>

                  <b-form-radio value="specificDate" v-model="availabilityModule" @change="validateModule">
                    Em uma data específica.
                  </b-form-radio>
                  <span v-if="availabilityModule === 'specificDate'">
                    <label class="d-block">Selecione a data de lançamento</label>
                    <b-form-group>
                      <b-form-datepicker v-model="module.releaseDate" hide-header class="input-border" locale="pt"
                                         :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                                         placeholder="Digite ou selecione a data" @context="validateModule"></b-form-datepicker>
                    </b-form-group>
                  </span>
                </b-form-group>

                <label class="d-block mt-4">O método possui período de validade?</label>
                <b-form-group class="radio-style">
                  <b-form-radio value="N" name="expiration" v-model="expirationModule" @change="validateModule">
                    <strong>Não</strong>, o acesso é por tempo indeterminado.
                  </b-form-radio>
                  <b-form-radio value="Y" name="expiration" v-model="expirationModule" @change="validateModule">
                    <strong>Sim</strong>, os alunos só acessam por um período específico.
                  </b-form-radio>

                  <span v-if="expirationModule === 'Y'">
                  <label class="d-block">Qual o prazo de validade desse módulo?</label>
                  <b-form-group>
                    <b-form-input v-model="module.expirationDays" class="input-border" type="number"
                                  placeholder="Insira a quantidade de dias" @change="validateModule"/>
                  </b-form-group>
                </span>
                </b-form-group>

                <label class="d-block mt-4">Outras opções</label>
                <b-form-group class="checkbox-style">
                  <b-form-checkbox-group v-model="permissions" :options="otherOptionsModule"></b-form-checkbox-group>
                </b-form-group>
              </div>
            </div>

            <div :class="['input-step-group', {'active': position === 3}]" v-if="position <= 3">
              <div class="item-form">
                <label class="d-block">Título da aula</label>
                <b-form-group>
                  <b-form-input v-model="lesson.title" class="input-border" type="text"
                                placeholder="Insira o título da sua aula"/>
                </b-form-group>

                <label class="d-block mt-4">Deseja exibir quem são autores?</label>
                <b-form-group class="radio-style">
                  <b-form-radio :value="false" v-model="lesson.showAuthors">
                    <strong>Não</strong>, ocultar autores.
                  </b-form-radio>
                  <b-form-radio :value="true" v-model="lesson.showAuthors">
                    <strong>Sim</strong>, exibir autores.
                  </b-form-radio>
                </b-form-group>

                <label class="d-block mt-4">Quando será disponibilizada?</label>
                <b-form-group class="radio-style">
                  <b-form-radio value="immediate" v-model="availabilityClass">
                    Imediatamente, assim que o curso for publicado.
                  </b-form-radio>
                  <b-form-radio value="afterRegistration" v-model="availabilityClass">
                    De acordo com a matrícula do aluno.
                  </b-form-radio>
                  <span v-if="availabilityClass === 'afterRegistration'">
                  <label class="d-block">Quantos dias após a matrícula?</label>
                <b-form-group>
                  <b-form-input v-model="lesson.releaseDaysAfterPurchase" class="input-border" type="number"
                                placeholder="Insira a quantidade de dias"/>
                </b-form-group>
                </span>
                  <b-form-radio value="specificDate" v-model="availabilityClass">
                    Em uma data específica.
                  </b-form-radio>
                  <span v-if="availabilityClass === 'specificDate'">
                  <label class="d-block">Selecione a data de lançamento</label>
                <b-form-group>
                  <b-form-datepicker v-model="lesson.releaseDate" class="input-border" locale="pt"
                                     :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
                                     placeholder="Digite ou selecione a data"></b-form-datepicker>
                </b-form-group>
                </span>
                </b-form-group>

                <label class="d-block mt-4">A aula possui período de validade?</label>
                <b-form-group class="radio-style">
                  <b-form-radio value="N" v-model="lesson.expirationLesson">
                    <strong>Não</strong>, o acesso é por tempo indeterminado.
                  </b-form-radio>
                  <b-form-radio value="Y" v-model="lesson.expirationLesson"
                                @change="validate(module.hasExpiration)">
                    <strong>Sim</strong>, os alunos só acessam por um período específico.
                  </b-form-radio>

                  <span v-if="lesson.expirationLesson === 'Y'">
                  <label class="d-block">Qual o prazo de validade desse módulo?</label>
                  <b-form-group>
                  <b-form-input v-model="lesson.expirationDays" class="input-border" type="number"
                                placeholder="Insira a quantidade de dias"/>
                  </b-form-group>
                </span>
                </b-form-group>

                <label class="d-block mt-4">Outras opções</label>
                <b-form-group class="checkbox-style">
                  <b-form-checkbox-group v-model="permissionsLesson"
                                         :options="lessonsOptionsModule"></b-form-checkbox-group>
                </b-form-group>

                <label class="d-block mt-4">Selecione qual conteúdo deseja adicionar</label>
                <FormMultimedia :multimediaList="classContent" @add-multimedia="setClassComposition"/>
              </div>
            </div>
            <div class="pl-3">
              <button class="btn d-inline btn-purple pl-4 pr-4 mt-4" @click="nextPosition" :disabled="isDisabled">Ok
              </button>
            </div>
          </div>
        </div>
      </div>

      <ModalAddCategory @refresh-categories="getCategoriesList"/>
      <ModalAuthor @refresh-authors="getAuthorList"/>
      <ModalConfirmation :msg="msgConfirmation" :onlyConfirmation="true" :redirect="routeRedirect"/>

      <footer>
        <div class="progress-cadastro">
          <div class="state-progress" :style="{width: barPercent+'%'}"/>
        </div>
        <div class="content-footer">
          <button class="d-block btn btn-rounded-grey" @click="backPage">
            <span
              class="d-inline-block arrow-back-ico mr-2"></span>{{
              this.step === 3 && position > 1 ? "Voltar para Módulos" : "Voltar para Cursos"
            }}
          </button>

          <div>
            <b-button v-if="step <= 2 || (step === 3 && position === 1)" class="btn-rounded-purple mr-3 pl-4 pr-4"
                      v-b-tooltip="'Salvar rascunho'" @click="processData()">
              Salvar rascunho
            </b-button>

            <b-button v-if="step <= 2 || (step === 3 && position === 1)" class="btn-purple pl-4 pr-4"
                      v-b-tooltip="'Publicar curso'" @click="processData(true)"
                      :disabled="((step === 1 && position < 5) || (step === 2 && position < 3) || isDisabled) && !(!isDisabled && id)">
              Publicar curso
            </b-button>

            <b-button v-if="step === 3 && position === 2" class="btn-purple pl-4 pr-4" v-b-tooltip="'Adicioanr módulo'"
                      @click="addModule" :disabled="disableModuleBtn">
              Adicionar módulo
            </b-button>

            <b-button v-if="step === 3 && position === 3" class="btn-purple pl-4 pr-4" @click="addLesson"
                      v-b-tooltip="'Adicionar aula'" :disabled="classContent.length === 0 || !lesson.title">
              Adicionar aula
            </b-button>
          </div>

        </div>
      </footer>
    </div>
    <CourseSideProgressAdd
      @change-position="changeInputProgress"
      @change-step="changeStep"
      :currentStep="step"
      :currentPosition="position"
      :itemsNavigator="itemsNavigator[position-1]"
      :moduleAnswers="module"
      :lessonAnswers="lesson"
      :classContent="classContent"
      :itensProgress="itensProgress"/>

    <ModalNotification :message="notificationMessage" :type="notificationtype"/>
  </div>
</template>

<script>
import Header from '../../../components/Menu/Header.vue';
import draggable from "vuedraggable";

export default {
  components: {Header, draggable},
  head() {
    return {
      title: "Adicionar Curso - Masters",
    }
  },
  data() {
    return {
      position: 1,
      msgConfirmation: null,
      routeRedirect: null,
      step: 1,
      id: null,
      headerText: [
        {title: 'Vamos cadastrar seu novo curso!', subtitle: 'Primeiro precisamos de alguns dados básicos'},
        {
          title: 'Legal! Agora algumas configurações avançadas',
          subtitle: 'Vamos configurar algumas opções para os seus alunos'
        },
        {
          title: 'Hora do conteúdo!',
          subtitle: 'Agora você já pode adicionar módulos e aulas ao seu curso!<br>Que tal começar com um módulo introdutório?'
        }],
      subtitle: 'Primeiro precisamos de alguns dados básicos',
      isDisabled: true,
      categoriesList: [],
      authorList: [],
      permissionOptions: [
        {text: 'Marcar aula como assistida', value: 'manualCheck'},
        {text: 'Acessar simultâneamente por mais de um dispositivo', value: 'hasSimultaneousAccess'},
        {text: 'Ver o progresso do curso em porcentagem e quantidade de aulas concluídas', value: 'canDisplayProgress'},
        {text: 'Emitir certificado automaticamente', value: 'issueCertificate'}
      ],
      otherOptionsModule: [
        {text: 'Esse módulo é gratuito', value: 'accessType'},
        {text: 'Esse módulo ficará oculto', value: 'showModule'},
        {text: 'Notificar os alunos sobre a alteração desse módulo', value: 'notifyStudents'}
      ],
      lessonsOptionsModule: [
        {text: 'Esse aula é gratuita', value: 'accessType'},
        {text: 'Esse aula ficará oculta', value: 'showClass'},
        {text: 'Os alunos podem fazer comentários nessa aula', value: 'allowStudentsComments'}
      ],
      permissions: [],
      permissionsLesson: [],
      term: null,
      course: {
        title: null,
        categories: [],
        authors: [],
        accessType: null,
        description: null,
        coverImage: null,
        supportPage: null,
        manualCheck: false,
        hasSimultaneousAccess: false,
        canDisplayProgress: false,
        issueCertificate: false,
        certificateIssuePercentage: 0,
        termsAndConditions: null,
        publishCourse: false
      },
      coverImage:{
        file: null,
        base64: null
      },
      module: {
        title: null,
        availability: null,
        hasExpiration: null,
        lessons: [],
        releaseDaysAfterPurchase: null,
        releaseDate: null,
        expirationDays: null,
        classes: []
      },
      availabilityModule: null,
      availabilityClass: null,
      expirationModule: null,
      lesson: {
        moduleIndex: null,
        title: null,
        showAuthors: null,
        expirationLesson: null,
        showClass: null,
        releaseDate: null,
        releaseDaysAfterPurchase: null,
        expirationDays: null,
        allowStudentsComments: null,
        accessType: null,
        contents: []
      },
      contentTypes: {
        'text': "TEXTO",
        'video': 'VIDEO',
        'file': 'ARQUIVO',
        'audio': 'AUDIO',
        'incorporate': 'EMBEDDED',
        'task': 'ATIVIDADE'
      },
      moduleList: [],
      classContent: [],
      classes: {},
      itensProgress: [
        {
          title: "Sobre o curso",
          subItems: [
            {title: 'Título'},
            {title: 'Categoria'},
            {title: 'Autores'},
            {title: 'Acesso'},
            {title: 'Imagem'},
          ],
        },
        {
          title: "Opções do aluno",
          subItems: [
            {title: 'Página de suporte'},
            {title: 'Permissões'},
            {title: 'Termos e condições'},
          ],
        },
        {
          title: "Módulos e aulas",
          subItems: [],
        },
      ],
      itemsNavigator: [
        {position: 1, title: null},
        {
          position: 2, title: "Criar módulo", icon: "folder",
          steps: [
            {stepsTitle: "Título"},
            {stepsTitle: "Disponibilidade"},
            {stepsTitle: "Validade"},
            {stepsTitle: "Outras Opções"},
          ]
        },
        {
          position: 3, title: "Criar aula", icon: "folder",
          steps: [
            {stepsTitle: "Título"},
            {stepsTitle: "Autoria"},
            {stepsTitle: "Disponibilidade"},
            {stepsTitle: "Validade"},
            {stepsTitle: "Outras Opções"},
            {stepsTitle: "Conteúdo"},
          ]
        },
      ],
      currentModule: null,
      notificationMessage: null,
      notificationtype: null,
      disableModuleBtn: true
    }
  },
  watch: {
    'course.title': function (newValue) {
      if (newValue) {
        this.itemsNavigator[0].title = newValue;
      }
    }
  },
  methods: {
    validateModule(){
      this.disableModuleBtn = (!this.module.title || !this.availabilityModule || !this.expirationModule
        || (this.availabilityModule === 'registration' && !this.module.releaseDaysAfterPurchase)
        || (this.availabilityModule === 'specificDate' && !this.module.releaseDate)
        || (this.expirationModule === 'Y' && !this.module.expirationDays)
      )
    },
    backPage() {
      if (this.step === 3 && this.position > 1) {
        this.position = 1;
      } else {
        $nuxt.$router.push('/content/cursos')
      }
    },
    nextPosition() {
      this.position += 1;
      this.isDisabled = !this.id;

      if (this.position === 2 && this.step === 2) {
        this.isDisabled = false;
      } else if (this.step === 1 && this.position === 6) {
        this.step = 2;
        this.position = 1;
        this.isDisabled = false;
      } else if (this.step === 2 && this.position === 4) {
        this.step = 3;
        this.position = 1;
        this.isDisabled = true;
      }
      else if (this.step === 3 && this.position === 2) {
        if(!this.course.title || this.course.authors.length === 0 || this.course.categories.length === 0){
          this.position = 1;
          this.notificationMessage = "Informe todos os dados do curso para continuar.";
          this.notificationtype = "alert";
          this.$bvModal.show('notification');
        }
        this.module = {};
      }

      this.isDisabled = false;
    },
    validate(value) {
      if ((this.course.issueCertificate && !this.course.certificateIssuePercentage) ||
        (this.course.term && this.course.term === 'Y' && !this.course.acceptanceText) || !value || value.length === 0) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
    },
    setProperty(value) {
      this.course[value.prop] = value.collection ? value.collection : value.item;

      if (this.course[value.prop] && this.course[value.prop].length > 0) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    },
    setImage(obj){
      this.coverImage.base64 = obj.base64;
      this.coverImage.file = obj.file;
    },
    processData(publish){
      if(this.coverImage.file) {
        const fileDir = `arquivos/${this.$randomString()}.type.${this.coverImage.file.type.replace('/', '-')}`;
        this.$postFileAWS(fileDir, this.coverImage.file).then(resp => {
          this.course.coverImage = fileDir;
          this.sendForm(publish);
        }).catch(err => {
          console.log(err)
          this.isLoading = true;
        });
      }
      else {
        this.sendForm(publish);
      }
    },
    sendForm(publish) {
      let authors = [];

      this.course.authors.forEach(author => {
        authors.push(author.id);
      });
      this.course.authors = authors;

      let categories = [];
      this.course.categories.forEach(category => {
        categories.push(category.id);
      })
      this.course.categories = categories;

      this.permissions.forEach(option => {
        this.course[option] = true;
      })

      this.course.certificateIssuePercentage = parseFloat(this.course.certificateIssuePercentage);

      this.course.publishCourse = publish;

      this.msgConfirmation = publish ? 'Curso publicado com sucesso!' : 'O seu rascunho está salvo!';
      this.routeRedirect = publish ? '/content/cursos' : null;

      if (this.course.id) {
        this.$axios.$put('/course/' + this.course.id, this.course).then(response => {
          this.sendModules(this.course.id);
          this.routeRedirect = '/content/cursos';
        }).catch(e => {
          console.log(e)
        }).finally(() => {
          this.isLoading = false;
        })
      } else {
        this.$axios.$post('/course', this.course).then(response => {
          this.sendModules(response.data.id);
          this.$bvModal.show('confirmation');
          this.routeRedirect = '/content/cursos';
        }).catch(e => {
          console.log(e)
        }).finally(() => {
          // this.isLoading = false;
        })
      }
    },
    sendLesson(moduleId, classes, updateModuleList) {
      classes.forEach((lesson, index) => {
        this.course.authors.forEach(author => {
          lesson.authors.push(author.id);
        });

        const mediaContent = lesson.contents;
        delete lesson.contents;

        try {
          if (isNaN(lesson.id)) {
            this.$axios.$put(`/class?id=${lesson.id}`, lesson);
          } else {
            delete lesson.id;
            this.$axios.$post(`/class?moduleId=${moduleId}`, lesson).then(resp => {
              this.sendContent(resp.data.id, mediaContent, updateModuleList)
            })
          }
        } catch (error) {
          console.log(error);
        }
      });
    },
    sendContent(classId, contentList, updateModuleList) {
      let contentGroup = [];
      contentList.forEach((dynamicContent, index) => {
        let mediaContent = {};
        switch (dynamicContent.type) {
          case 'task':
            mediaContent = {
              title: dynamicContent.title,
              contentType: dynamicContent.contentType,
              rightAnswer: dynamicContent.rightAnswer,
              options: dynamicContent.options
            }
            break;
          case 'video':
            mediaContent = {link: dynamicContent.link}
            break;
          case 'file':
            if(dynamicContent.content.file) {
              const fileDir = dynamicContent.url ? dynamicContent.url :`arquivos/${this.$randomString()}.type.${dynamicContent.content.file.type.replace('/', '-')}`;
              this.$postFileAWS(fileDir, dynamicContent.content.file);
              mediaContent = {name: dynamicContent.name, content: fileDir}
            }
            else {
              mediaContent = {name: dynamicContent.name, content: dynamicContent.url}
            }
            break;
          case 'audio':
            if(dynamicContent.content.file) {
              const audioDir = dynamicContent.url ? dynamicContent.url :`arquivos/${this.$randomString()}.type.${dynamicContent.content.file.type.replace('/', '-')}`;
              this.$postFileAWS(audioDir, dynamicContent.content.file)
              mediaContent = {content: audioDir}
            }
            else {
              mediaContent = {content: dynamicContent.url}
            }
            break;
          default:
            mediaContent = {text: dynamicContent.text}
        }

        const formattedContent = {
          sequence: index,
          title: dynamicContent.title,
          type: this.contentTypes[dynamicContent.type],
          includeDRM: dynamicContent.hasDRM ?? false,
          enableDownload: dynamicContent.canDownload ?? false,
          description: JSON.stringify(mediaContent)
        }
        contentGroup.push(formattedContent)
      });

      try {
        this.$axios.$post(`/content?classId=${classId}`, contentGroup).then(resp => {
          console.log(resp)
        }).finally(()=>{
          if(updateModuleList){
            this.getModuleList();
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    updateContent(content, sequence) {
      const contentID = content.id;
      const formattedContent = this.formatContent(content, sequence)

      try {
        this.$axios.$put(`/content?id=${contentID}`, formattedContent).then(resp => {
          console.log(resp)
        });
      } catch (error) {
        console.log(error);
      }
    },
    formatContent(content, sequence){
      let mediaContent = {};
      switch (content.type) {
        case 'task':
          mediaContent = {
            title: content.title,
            contentType: content.contentType,
            rightAnswer: content.rightAnswer,
            options: content.options
          }
          break;
        case 'video':
          mediaContent = {link: content.link}
          break;
        case 'file':
          mediaContent = {name: content.name, content: content.content}
          break;
        default:
          mediaContent = {text: content.text}
      }

      const formattedContent = {
        sequence: sequence,
        type: this.contentTypes[content.type],
        includeDRM: content.hasDRM ?? false,
        enableDownload: content.enableDownload ?? false,
        description: JSON.stringify(mediaContent)
      }

      return formattedContent;
    },
    sendModules(couseId) {
      this.moduleList.forEach(module => {
        this.saveModule(couseId, module);
      });
    },
    saveModule(couseId, module, updateModuleList){
      const classes = module.classes;
      delete module.classes;

      try {
        if (isNaN(module.id)) {
          this.$axios.$put(`/module/${module.id}`, module).then(resp => {
            this.sendLesson(resp.data.id, classes);
          });
        } else {
          delete module.id;
          const ObjModule = {...module};
          ObjModule.course = couseId;
          this.$axios.$post('/module', ObjModule).then(resp => {
            this.sendLesson(resp.data.id, classes);
          }).finally(()=>{
            if(updateModuleList){
              this.getModuleList();
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    changeStep(step) {
      this.step = step + 1;
      this.position = 1;
    },
    changePosition(pos) {
      this.position = pos;
    },
    changeInputProgress(e) {
      if (e.indexItem + 1 !== this.step) {
        this.changeStep(e.indexItem)
      }
      this.position = e.indexSub + 1;
    },
    getCategoriesList() {
      const url = `/category/all?page=${1}&size=${1000}&orderBy=${'name'}&direction=${'ASC'}`;
      this.$axios.$get(url).then(response => {
        this.categoriesList = [...response.data];
      });
    },
    getAuthorList() {
      const url = `/author/all?page=${1}&size=${1000}&orderBy=${'name'}&direction=${'ASC'}`;
      this.$axios.$get(url).then(async response => {
        for(const author of response.data) {
          let author_copy = {...author};
          author_copy.image = await this.$getFileAWS(author.image);
          this.authorList.push(author_copy);
        }
      });
    },
    getModuleList() {
      const url = `/module/all?courseId=${this.id}&size=${1000}&page=1`;
      this.$axios.$get(url).then(response => {
        this.moduleList = [...response.data];
        this.moduleList.forEach((module, index) => {
          this.classes[index] = module.classes;
        })
      })
    },
    getClass({lesson, moduleID}) {
      if (isNaN(lesson.id)) {
        this.$axios.$get(`/class?id=${lesson.id}`).then(response => {
          this.lesson = {...response.data};
          this.lesson.contents.forEach(content => {
            let classContent = {...content, ...JSON.parse(content.description)};
            delete classContent.description;

            const types = {
              "TEXTO" : 'text',
              'VIDEO' : 'video',
              'ARQUIVO' :'file',
              'AUDIO' : 'audio',
              'EMBEDDED' : 'incorporate',
              'ATIVIDADE' : 'task'
            }
            classContent.type = types[content.type];

            this.classContent.push(classContent)
            this.step = 3;
            this.position = 3;
            this.currentModule = moduleID;

            if (!this.lesson.releaseDaysAfterPurchase && !this.lesson.releaseDate) {
              this.availabilityClass = 'immediate'
            } else {
              this.availabilityClass = this.lesson.releaseDate ? 'specificDate' : 'afterRegistration';
            }

            this.lesson.expirationLesson = this.expirationDays ? 'Y' : 'N';

            if (this.lesson.accessType.includes('accessType')) {
              this.permissionsLesson.push('accessType')
            }

            if (this.lesson.showClass) {
              this.permissionsLesson.push('showClass')
            }
          })
        });
      } else {
        this.lesson = lesson;
        this.classContent = lesson.contents
        this.step = 3;
        this.position = 3;
        this.currentModule = moduleID;
      }

    },
    removeClass({classID, moduloID}) {
      if(isNaN(classID)) {
        this.$axios.$delete(`/class/${classID}`).then(response => {
          console.log(response)
          this.getModuleList();
        })
      } else {
        const moduleIdx = this.moduleList.findIndex(({id}) => {
          return moduloID === id
        })

        const classIdx = this.moduleList[moduleIdx].classes.findIndex(({id}) => {
          return classID === id
        })

        this.moduleList[moduleIdx].classes.splice(classIdx, 1)
      }
    },
    addModule() {
      let moduleID = null;
      let idx = null;

      if (this.module.id) {
        idx = this.moduleList.findIndex(module => {
          return module.id === this.module.id
        })

        if (idx >= 0) {
          moduleID = this.moduleList[idx].id
        }
      }

      let paramsModule = {
        sequence: this.module.sequence ?? this.moduleList.length + 1,
        title: this.module.title,
        accessType: this.permissions.includes('accessType') ? 'GRATIS' : 'PAGO',
        showModule: this.permissions.includes('showModule'),
        notifyStudents: this.permissions.includes('notifyStudents'),
        releaseDaysAfterPurchase: this.module.releaseDaysAfterPurchase ? Number(this.module.releaseDaysAfterPurchase) : null,
        releaseDate: this.module.releaseDate,
        expirationDays: this.module.expirationDays ? Number(this.module.expirationDays) : null,
        classes: this.module.classes ?? []
      };

      this.availabilityModule !== 'registration' && delete paramsModule.releaseDaysAfterPurchase;
      this.availabilityModule !== 'specificDate' && delete paramsModule.releaseDate;
      this.expirationModule === 'N' && delete paramsModule.expirationDays;

      if (moduleID && isNaN(moduleID)) {
        paramsModule.id = moduleID;
        this.moduleList[idx] = paramsModule;
        this.$axios.$put(`/module/${moduleID}`, paramsModule).then(resp => {
          console.log(resp)
        });
      } else if (!isNaN(idx) && idx === null) {
        paramsModule.id = new Date().getTime();
        this.moduleList.push(paramsModule);
      } else {
        paramsModule.id = moduleID;
        this.moduleList[idx] = paramsModule
      }

      if(this.id){
        this.saveModule(this.id, paramsModule, true)
      }

      this.module = {};
      this.availabilityModule = null;
      this.permissions = [];
      this.backPage();
    },
    openFormLesson(moduleId) {
      this.currentModule = moduleId;
      this.lesson = {};
      this.classContent = [];
      this.availabilityClass = null;
      this.permissionsLesson = [];
      this.lesson.id = new Date().getTime();
      this.step = 3;
      this.position = 3;
    },
    addLesson() {
      let status = this.classContent.every(content => {
        if(["ATIVIDADE", "task"].includes(content.type)){

          if(!content.options || content.options.length === 0) {
            this.notificationMessage = "A sua atividade não possui conteúdo válido";
            this.notificationtype = "error";
            this.$bvModal.show('notification');
            return false;
          }

          const idx = content.options.findIndex(option => {
            return option.value === null || option.text === null
          })

          if(!content.title || idx >= 0){
            this.notificationMessage = "Revise o preenchimento dos campos de atividades.";
            this.notificationtype = "alert";
            this.$bvModal.show('notification');
            return false;
          }

          if(content.rightAnswer.length === 0 ){
            this.notificationMessage = "A questão <strong>"+ content.title + "</strong> não possui uma resposta correta."
            this.notificationtype = "alert";
            this.$bvModal.show('notification');
            return false;
          }
        }
        else if(["VIDEO", "video"].includes(content.type)){
          if(!content.link){
            this.notificationMessage = "Informe o link do vídeo do seu conteúdo.";
            this.notificationtype = "alert";
            this.$bvModal.show('notification');
            return false;
          }
        }
        else if(["TEXTO", "text"].includes(content.type)){
          if(!content.text){
            this.notificationMessage = "Falta o conteúdo textual da sua atividade.";
            this.notificationtype = "alert";
            this.$bvModal.show('notification');
            return false;
          }
        }
        else if(["ARQUIVO", "AUDIO", "file", "audio"].includes(content.type)){
          if(!content.content){
            this.notificationMessage = "Falta o conteúdo de texto para a sua atividade.";
            this.notificationtype = "alert";
            this.$bvModal.show('notification');
            return false;
          }
        }

        if(isNaN(content.id) && content.modified){
          delete content.modified;
          this.updateContent(content)
        }
        else if(!isNaN(content.id) && isNaN(this.lesson.id)){
          this.sendContent(this.lesson.id, [content])
        }

        return true;
      })

      if(!status) return status;

      const paramsLesson = {
        id: this.lesson.id,
        title: this.lesson.title,
        showAuthors: this.lesson.showAuthors,
        showClass: !this.permissionsLesson.includes('allowStudentsComments'),
        releaseDate: this.lesson.releaseDate,
        releaseDaysAfterPurchase: this.lesson.releaseDaysAfterPurchase ? Number(this.lesson.releaseDaysAfterPurchase) : null,
        expirationDays: this.lesson.expirationDays,
        allowStudentsComments: this.permissionsLesson.includes('allowStudentsComments'),
        accessType: this.permissionsLesson.includes('accessType') ? 'GRATIS' : 'PAGO',
        authors: [],
        contents: this.classContent
      }

      this.availabilityClass !== 'registration' && delete paramsLesson.releaseDaysAfterPurchase;
      this.availabilityClass !== 'specificDate' && delete paramsLesson.releaseDate;
      this.lesson.expirationLesson === 'N' && delete paramsLesson.expirationDays;

      const idxModule = this.moduleList.findIndex(mdl => {
        return mdl.id === this.currentModule
      })

      const idxClass = this.moduleList[idxModule].classes.findIndex(({id}) => {
        return id === this.lesson.id
      })

      if(isNaN(this.currentModule)) {
        this.sendLesson(this.currentModule, [paramsLesson], true);
      }
      else if(idxClass >= 0) {
          this.moduleList[idxModule].classes[idxClass] = paramsLesson;
      }
      else {
        this.moduleList[idxModule].classes.push(paramsLesson);
      }

      this.lesson = {};
      this.classContent = [];
      this.availabilityClass = null;
      this.permissionsLesson = [];
      this.$forceUpdate();

      this.currentModule = null;
      this.step = 3;
      this.position = 1;
    },
    setClassComposition(params) {
      this.classContent = params.collection;
    },
    editModule(moduleId) {
      const idx = this.moduleList.findIndex(({id}) => {
        return id === moduleId
      })

      if (idx >= 0) {
        this.module = {...this.moduleList[idx]};
        this.step = 3;
        this.position = 2;
      } else {
        return false
      }

      if (!this.module.releaseDaysAfterPurchase && !this.module.releaseDate) {
        this.availabilityModule = 'immediate'
      } else {
        this.availabilityModule = this.module.releaseDate ? 'specificDate' : 'registration';
      }

      this.expirationModule = this.module.expirationDays ? 'Y' : 'N';

      if (this.module.accessType === 'GRATIS') {
        this.permissions.push('accessType')
      }

      if (this.module.notifyStudents) {
        this.permissions.push('notifyStudents')
      }

      if (this.module.showModule) {
        this.permissions.push('showModule')
      }
    }
  },
  computed: {
    barPercent() {
      if (this.step === 1) {
        return ((100 / 12) * (this.position))
      } else if (this.step === 2) {
        return ((100 / 12) * (this.position + 5))
      } else if (this.step === 3) {
        return ((100 / 12) * (this.position + 8))
      }
    }
  },
  mounted() {
    this.getCategoriesList();
    this.getAuthorList();

    if ($nuxt.$route.params.id) {
      this.id = $nuxt.$route.params.id;
      this.$axios.$get('/course', {params: {id: this.id}}).then(response => {
        this.course = {...response.data};

        this.$getFileAWS(this.course.coverImage).then(resp => {
          this.coverImage.base64 = resp;
        });

        this.term = this.course.termsAndConditions ? 'Y' : 'N'

        this.categoriesList.forEach(category => {
          this.course.categories.forEach(c => {
            if (c.id === category.id) {
              category.selected = true;
            }
          })
        })

        this.authorList.forEach(author => {
          this.course.authors.forEach(a => {
            if (a.id === author.id) {
              author.selected = true;
            }
          })
        });

        this.permissionOptions.forEach(({value}) => {
          if (this.course[value]) {
            this.permissions.push(value);
          }
        })

        this.isDisabled = false;
      }).finally(() => {
        this.getModuleList();
      });
    }
  }
}
</script>

<style scoped>
.form-addCurso {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
}

header {
  padding-left: 66px;
}

.sub-text-form {
  font: 14px "Inter Regular";
  color: #828287;
}

.form-addCurso .main-form {
  padding: 40px 0 40px 0;
  max-height: 100%;
  overflow: hidden;
}

.form-addCurso .main-form.course-module {
  padding: 27px 0 40px 0;
}

.content-addCurso-form {
  display: block;
  padding: 30px 0 0 66px;
  height: calc(100% - 121px);
}

.course-module .content-addCurso-form {
  padding-top: 24px;
}

.group-inputs-carousel {
  position: relative;
  display: inline-block;
  bottom: -16px;
  height: 100px;
  width: 100%;
}

.group-inputs-carousel.group-module {
  bottom: -50px;
}

.group-inputs-carousel .input-step-group {
  position: relative;
  display: grid;
  grid-template-columns: 572px auto;
  transition: .3s all;
  padding-left: 2px;
  z-index: -1;
}

.group-inputs-carousel .input-step-group .item-form {
  padding: 0 2px;
  display: inline-block;
  max-width: 572px;
  height: 100%;
  overflow-y: auto;
}

.course-module .group-inputs-carousel .input-step-group {
  grid-template-columns: 671px auto;
}

.course-module .group-inputs-carousel .input-step-group .item-form {
  max-width: 671px;
}

.group-inputs-carousel .input-step-group.active {
  width: 100%;
  height: calc(100vh - 381px);
  z-index: 1;
  background-color: #fff;
  top: -16px;
}

.group-inputs-carousel.group-module .input-step-group.active {
  top: -50px;
}

.group-inputs-carousel .box-info-image {
  height: max-content;
  width: 405px;
  background: #FBFBFB;
  border: 1px solid #F2F2F2;
  border-radius: 16px;
  padding: 32px;
}

/* footer */
footer {
  grid-column: 1/-1;
  z-index: 5;
  box-shadow: -19px -20px 20px 5px rgb(255 255 255);
  height: 108px;
}

footer .progress-cadastro {
  background: #F2F2F2;
  width: 100%;
  height: 2px;
}

footer .progress-cadastro .state-progress {
  background: #A7A7AB;
  height: 2px;
}

footer .content-footer {
  background: #FFFFFF;
  width: 100%;
  height: 108px;
  padding: 0 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}
</style>

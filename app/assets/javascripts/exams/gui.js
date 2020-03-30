Exams.Gui = class{
  constructor(tbody, backend){
    this.$tbody = tbody
    this.backend = backend
    this.$modal = $("[data-exams='modal']")
    this.$examFields = $("[data-exams='field']")
    this.patientId = $('[data-exams-patient-id]').data().examsPatientId
    this.$btnCreate = $("[data-exams='btn-create']")
    this.bindingEvents()
  }

  bindingEvents(){
    this.$btnCreate.on("click", (e) => this.btnClickHandlerToShowCreateForm(e))
    this.$tbody.on("click", "[data-exams='btn-edit']", (e) => this.btnClickHandlerToShowEditForm(e))
    this.$tbody.on("click", "[data-exams='btn-show']", (e) => this.btnClickHandlerToShowShow(e))
    this.$modal.on('click', "[data-exam='btn-save']", (e) => this.btnClickHandlerToSaveExam(e))
    this.$modal.on("ajax:success", 'form', (e) => this.responseSuccessHandler(e))
    this.$modal.on("ajax:error", 'form', (e) => this.responseErrorHandler())
    this.$modal.on("ajax:complete", 'form', (e) => this.responseCompleteHandler())
  }

  responseSuccessHandler(e){
    let exam = new Exams.Exam(e.detail[0])
    if($(`[data-exam-id="${exam.id}"]`).length > 0){
      let tr = $(`[data-exam-id="${exam.id}"]`)
      tr.after(this.examRow(exam))
      tr.remove()
    }else{
      this.$tbody.append(this.examRow(exam))
    }
  }

  responseCompleteHandler(){
    this.$modal.modal('hide')
  }

  render3D(){
    var camera, scene, renderer;
    var geometry, material, mesh;

    init();
    animate();

    function init() {

	  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	  camera.position.z = 0.5;

	  scene = new THREE.Scene();

    var geometry = new THREE.PlaneGeometry( 0.2, 0.2, 0.2 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, wireframe: true} );
    var plane = new THREE.Mesh( geometry, material );


    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
  }

    function animate() {
      requestAnimationFrame( animate );
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.02;
      renderer.render( scene, camera );
    }
  }

  responseErrorHandler(){
    alert('Error on exam create/edit')
  }

  btnClickHandlerToShowEditForm(e){
    let examId = $(e.target).closest('[data-exam-id]').data().examId
    this.loadFormOnModal(this.backend.editPath(examId))
  }

  btnClickHandlerToShowShow(e){
    let examId = $(e.target).closest('[data-exam-id]').data().examId
    this.loadShow3D(this.backend.showPath(examId))
  }

  btnClickHandlerToShowCreateForm(e){
    this.loadFormOnModal(this.backend.newPath())
  }

  loadFormOnModal(url){
    this.$modal.find('.modal-content').load(`${url}`, () => this.$modal.modal('show'))
  }
  
  loadShow3D(url){
   this.render3D()
  }

  addExams(exams){
    this.$tbody.html('')
    for(let exam of exams){
      let row = this.examRow(new Exams.Exam(exam))
      this.$tbody.append(row)
    }
  }

  examRow(exam){
    let html = `<tr data-exam-id='${exam.id}'>`
    html += `<td data-exam-po-x='${exam.po.x}' data-exam-po-y='${exam.po.y}'>x: ${exam.po.x} y: ${exam.po.y}</td>`
    html += `<td data-exam-or-x='${exam.or.x}' data-exam-or-y='${exam.or.y}'>x: ${exam.or.x} y: ${exam.or.y}</td>`
    html += `<td data-exam-n-x='${exam.n.x}' data-exam-n-y='${exam.n.y}'>x: ${exam.n.x} y: ${exam.n.y}</td>`
    html += `<td data-exam-a-x='${exam.a.x}' data-exam-a-y='${exam.a.y}'>x: ${exam.a.x} y: ${exam.a.y}</td>`
    html += `<td data-exam-angle='${exam.angle}'>${exam.angle}</td>`
    html += `<td>
      <div class="float-right">
        <button class="btn btn-sm btn-secondary" type='button' data-exams='btn-show'">Show</button>
        <button class="btn btn-sm btn-secondary" type='button' data-exams='btn-edit'>Edit</button>
        <a class="btn btn-sm btn-danger delete" data-remote="true" data-confirm="Are you sure?" rel="nofollow" data-method="delete" href="/patients/${exam.patientId}/exams/${exam.id}">Destroy</a>
      </div>
    </td>`
    return html += `</tr>`
  }
}
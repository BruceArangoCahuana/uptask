import Swal from 'sweetalert2';
export const actualizarAvance = ()=>{
    //selecionar tareas existentes
    const tareas = document.querySelectorAll('li.tarea');
    if(tareas.length){
         //sleccionar las tareas completadas
         const tareasCompletas = document.querySelectorAll('i.completo');
         //calcular avance
         const avance = Math.round((tareasCompletas.length / tareas.length)*100);
          //mostrar el avance
          const porcentaje = document.querySelector("#porcentaje");
          porcentaje.style.width = avance+"%";

          if(avance === 100){
            Swal.fire(
                'Felicidades!',
                 'Haz culminado tus proyectos',
                'success'
            );
          }
    }
}
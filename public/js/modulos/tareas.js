import Swal from 'sweetalert2';
import axios from 'axios';
import {actualizarAvance} from '../funciones/avance'
const tareas = document.querySelector(".listado-pendientes");

if(tareas){
    tareas.addEventListener("click",(e)=>{
        if(e.target.classList.contains('fa-check-circle')){
           //trae el id
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
           //request hacia /tareas/:id
           const url = `${location.origin}/tareas/${idTarea}`;
           axios.patch(url,{idTarea})
           .then(function(respuesta){
            if(respuesta.status === 200){
                icono.classList.toggle('completo');
                actualizarAvance();
            }
           })
        }

        if(e.target.classList.contains('fa-trash')){
            const tareaHtml = e.target.parentElement.parentElement;
            const idTarea = tareaHtml.dataset.tarea;   
            
            Swal.fire({
                title: 'Estas seguro de eliminar esta tarea?',
                text: "Si eliminas ya no hay marcha atras",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'No eliminar'
              }).then((result) => {
                    if (result.isConfirmed) {
                        //enviar el delete por medio de axios
                        const url = `${location.origin}/tareas/${idTarea}`;
                        axios.delete(url,{
                            params:{ params:{idTarea}}
                        }).then(function(respuesta){
                            if(respuesta.status === 200){

                                //eliminar el nodo
                                tareaHtml.parentElement.removeChild(tareaHtml);
                                //opccional una alerta
                                Swal.fire(
                                    'Tarea eliminada!',
                                     respuesta.data,
                                    'success'
                                );
                                actualizarAvance();
                            }
                        })
                    }
              });    
        }
    })
}

export default tareas
import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector("#eliminar-proyecto");

if(btnEliminar){
    btnEliminar.addEventListener("click",(e)=>{
        const urlProyecto = e.target.dataset.proyectoUrl;
        //console.log(urlProyecto);
       
        Swal.fire({
            title: 'Estas seguro de eliminar?',
            text: "Si eliminas ya no hay marcha atras",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'No eliminar'
          }).then((result) => {
                if (result.isConfirmed) {
                    //enviar la peticion a axios
                    const URL = `${location.origin}/proyectos/${urlProyecto}`;
                        axios.delete(URL , {params:{urlProyecto}})
                        .then(function(respuesta){
                            Swal.fire(
                                'Eliminado!',
                                'Se elimo con exito',
                                'success'
                            );
                            //redireccionamos el usuario al inicio
                            window.location.href='/';
                                
                         
                        }).catch(()=>{
                            Swal.fire({
                                icon: 'warning',
                                type:'Error',
                                title:'Error al eliminar',
                                text:'Error al eliminar proyecto'
                            })
                        });
                        
                   
                }
          })
    });

}

export default btnEliminar;
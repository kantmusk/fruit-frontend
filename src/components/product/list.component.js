import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Swal from 'sweetalert2'
export default function List() {
    const [products, setProducts] = useState([])
  const [title, setTitle] = useState("")
  const [count, setCount] = useState("")
  const [image, setImage] = useState(null)
  const [validationError,setValidationError] = useState({})

    useEffect(()=>{
        fetchProducts() 
    },[])
    const fetchProducts = async () => {
        await axios.get(`http://localhost:8000/api/products`).then(({data})=>{
            setProducts(data)
        })
    }
    const deleteProduct = async (id) => {
        const isConfirm = await Swal.fire({
            title: 'Вы уверены?',
            text: "Этот продукт нельзя будет восстановить!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Да, хочу удалить!',
          }).then((result) => {
            return result.isConfirmed
          });
          if(!isConfirm){
            return;
          }
          await axios.delete(`http://localhost:8000/api/products/${id}`).then(({data})=>{
            Swal.fire({
                icon:"success",
                text:data.message
            })
            fetchProducts()
          }).catch(({response:{data}})=>{
            Swal.fire({
                text:data.message,
                icon:"error"
            })
          })
    }

    const incProduct = async (id, count) => {
      

        const formData = new FormData()

        formData.append('_method', 'PATCH');
        formData.append('id', id);
        formData.append('count', count);
        formData.append('w', 0);

        await axios.post(`http://localhost:8000/api/products/${id}/`, formData).then(({data})=>{
          Swal.fire({
            icon:"success",
            text:data.message
          })
          fetchProducts()
        }).catch(({response})=>{
            Swal.fire({
              text:response.data.message,
              icon:"error"
            })
        })
    }

      
   


    const decProduct = async (id, count) => {
        const formData = new FormData()

        formData.append('_method', 'PATCH');
        formData.append('id', id);
        formData.append('count', count);
        formData.append('w', 1);

        await axios.post(`http://localhost:8000/api/products/${id}/`, formData).then(({data})=>{
          Swal.fire({
            icon:"success",
            text:data.message
          })
          fetchProducts()
        }).catch(({response})=>{
            Swal.fire({
              text:response.data.message,
              icon:"error"
            })
        })
    }


    return (
      <div className="container">
          <div className="row">
            <div className='col-12'>
                <Link className='btn btn-primary mb-2 float-end' to={"/product/create"}>
                    Создать продукт
                </Link>
            </div>
            <div className="col-12">
                <div className="card card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered mb-0 text-center">
                            <thead>
                                <tr>
                                    <th>Наименование</th>
                                    <th>Количество</th>
                                    <th>Изображение</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    products.length > 0 && (
                                        products.map((row, key)=>(
                                            <tr key={key}>
                                                <td className='align-middle'>{row.title}</td>
                                                <td className='align-middle'>{row.count}</td>
                                                <td className='align-middle'>
                                                    <img width="90px" src={`http://localhost:8000/storage/product/image/${row.image}`} />
                                                </td>
                                                <td className='align-middle'>
                                                   
                                                    <Link to={`/product/edit/${row.id}`} className='btn btn-success me-2'>
                                                        Обновить
                                                    </Link> 
                                                    <Button variant="success" onClick={()=>incProduct(row.id, row.count)}>
                                                        +
                                                    </Button>{' '}
                                                    <Button variant="success" onClick={()=>decProduct(row.id, row.count)}>
                                                        -
                                                    </Button>{' '}

                                                    <Button variant="danger" onClick={()=>deleteProduct(row.id)}>
                                                        Удалить
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
          </div>
      </div>
    )
}
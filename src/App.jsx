import { useEffect, useState } from "react";
import api from "../api";

// icons
import { GiHamburgerMenu } from "react-icons/gi";
import { RiSearchLine } from "react-icons/ri";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { IoPersonAddSharp } from "react-icons/io5";
import "./styles/style.scss";
// components
import Card from "./components/Card";
import Modal from "./components/Modal";


function App() {

  //*State kurulumu
  const [contacts, setContacts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)

  useEffect(() => {
    api
      .get("/contacts")
      .then((res) => setContacts(res.data)
      )
  }, []);

  //! Form gönderildiğinde çalışacak fonk.
  const handleSubmit = (e) => {
    e.preventDefault()

    // Inputtaki değere eriş
    const query = e.target[1].value;

    // Api a gönderilecek parametreye eriş
    const params = {
      q: query,
    }

    // api a istek at ve gelen veriyi state e aktar
    api
      .get("contacts", { params })
      .then((res) => setContacts(res.data))
  }

  //! Sil ikonuna tıklanınca çalışacak fonk
  const handleDelete = (id) => {
    const res = confirm("Silme işlemini onaylıyor musunuz?")

    if (res) {
      api.delete(`/contacts/${id}`)
        .then(() => {
          // Silinen kişiyi contats state'den kaldır
          const updatedContacts = contacts.filter((contact) => contact.id != id)


          // güncellenmiş diziyi state' aktar
          setContacts(updatedContacts);

        })
    }

  }

  //! Güncelle ikonuna tıklanınca çalışacak fonk
  const handleEdit = (contact) => {

    // Modal'ı aç
    setIsModalOpen(true)

    // Güncellenecek kişinin verilerini state e aktar
    setEditItem(contact)


  }

  return (

    <div className="app">

      {/* Header */}
      <header>
        <h1>Rehber</h1>

        <div>
          <form onSubmit={handleSubmit} >
            <button><RiSearchLine /></button>
            <input type="search" placeholder='Kişi aratınız' />
          </form>

          <button className='ns'><GiHamburgerMenu /></button>
          <button className='ns'><HiMiniSquares2X2 /></button>
          <button onClick={() => setIsModalOpen(true)} className='add'><IoPersonAddSharp />
            <span>Yeni Kişi</span></button>
        </div>


      </header>

      {/*Main */}
      <main>
        {contacts.map((contact) => (
          <Card
            key={contact.id}
            handleDelete={handleDelete}
            contact={contact}
            handleEdit={handleEdit} />
        ))}
      </main>

      {/* Modal */}
      <Modal
        setEditItem={setEditItem}
        setContacts={setContacts}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editItem={editItem}
      />
    </div>
  )
}

export default App

import { IoCloseSharp } from "react-icons/io5";
import Field from "./Field";
import api from "../../api";
const Modal = ({ isModalOpen, setIsModalOpen, setContacts, editItem, setEditItem }) => {


    //! Form gönderildiğinde çalışacak fonk.
    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)  // JavaScript içerisinde bulunan formData yapısı sayesinde her bir input içeirisindeki verilere teker teker erişmek yerine hepsine tek bir seferde erişebiliriz


        const newContact = Object.fromEntries(formData.entries()) // Object.fromEntries() metodu, bir form'daki tüm inputların key-value çiftlerini bir object'e dönüştürür

        if (!editItem) {

            const response = await api.post("/contacts", newContact) // erişilen değerleri api ya gönder

            //! Contact state'ini güncelle. Önceki verileri koru ve yeni gelen veriyi ekle
            setContacts((contacts) => [...contacts, response.data])
        } else {

            // Güncellenecek kişiyi api ya gönder
            const res = await api.put(`/contacts/${editItem.id}`, newContact)

            // Güncellenecek kişiyi contacts state i içerisinde de güncelle
            setContacts((contacts) => contacts.map((contact) => contact.id === editItem.id ? res.data : contact))

            setEditItem(null)
        }

        //Modal penceresini kapat
        setIsModalOpen(false)

    }

    return (

        isModalOpen &&
        <div className="modal">
            <div className="modal-inner">
                {/* header */}
                <div className="modal-head">
                    {/* Edit modu ve ekle modu dinamikliği */}
                    <h2>{editItem ? "Kişiyi Güncelle" : "Yeni Kişi Ekle"}</h2>
                    <button onClick={() => {
                        setEditItem(null)
                        setIsModalOpen(false)
                    }} >
                        <IoCloseSharp />
                    </button>
                </div>

                {/* form */}
                <form onSubmit={handleSubmit}>
                    <Field value={editItem?.name} label="İsim Soyisim" name="name" />
                    <Field value={editItem?.position} label="Pozisyon" name="position" />
                    <Field value={editItem?.company} label="Şirket" name="company" />
                    <Field value={editItem?.phone} label="Telefon" name="phone" />
                    <Field value={editItem?.email} label="Email" name="email" />
                    <div className="buttons">
                        <button onClick={() => {
                            setEditItem(null)
                            setIsModalOpen(false)
                        }}>Vazgeç</button>
                        <button type="submit">Gönder</button>
                    </div>
                </form>
            </div>
        </div>

    )

}

export default Modal
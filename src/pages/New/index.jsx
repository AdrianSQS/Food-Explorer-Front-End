import { useState } from 'react';
import { api } from '../../services/api';
import { FiUpload } from "react-icons/fi";
import { Menu } from "../../components/Menu";
import { RxCaretLeft } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { useMediaQuery } from "react-responsive";
import { Header } from '../../components/Header';
import { Button } from "../../components/Button";
import { Footer } from '../../components/Footer';
import { RiArrowDownSLine } from "react-icons/ri";
import { Section } from '../../components/Section';
import { FoodItem } from '../../components/FoodItem';
import { Textarea } from '../../components/Textarea';
import { ButtonText } from "../../components/ButtonText";
import { Container, Form, Image, Category } from "./styles";

export function New({ isAdmin }) {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [name, setName] = useState("");
	const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");

  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImage(file);
    setFileName(file.name);
  }

  function handleAddTag() {
    setTags((prevState) => [...prevState, newTag]);
    setNewTag("");
  }

  function handleRemoveTag(deleted) {
    setTags((prevState) => prevState.filter((tag) => tag !== deleted));
  }

  async function handleNewDish() {
    if (!image) {
      return alert("Selecione a imagem do prato principal.");
    }

    if (!name) {
      return alert("Digite o nome do prato principal.");
    }

    if (!category) {
      return alert("Selecione a categoria do prato principal.");
    }

    if (tags.length === 0) {
      return alert("Por favor, inclua pelo menos um ingrediente para o prato principal.");
    }

    if (newTag) {
      return alert(
        "Você inseriu um ingrediente no campo de adição, mas ainda não clicou em 'Adicionar'. Por favor, clique para adicionar ou deixe o campo vazio.."
      );
    }

    if (!price) {
      return alert("Digite o preço do prato principal.");
    }

    if (!description) {
      return alert("Digite a descrição do prato principal.");
    }

    setLoading(true);
    
		const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("ingredients", JSON.stringify(tags));

    try {
      await api.post("/dishes", formData);
      alert("Prato principal cadastrado com sucesso!");
      navigate(-1);

    } catch (error) {

      if (error.response) {
        alert(error.response.data.message);

      } else {
        alert("Não foi possível cadastrar o prato principal.");
      }

    } finally {
      setLoading(false);
    }
	}

  return (
    <Container>
      {!isDesktop && 
        <Menu 
          isAdmin={isAdmin} 
          isDisabled={true} 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
        />
      }

      <Header 
        isAdmin={isAdmin} 
        isDisabled={true} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
      />

      <main>
        <Form>
          <header>
            <ButtonText onClick={handleBack}>
              <RxCaretLeft />
              voltar
            </ButtonText>

            <h1>Adicionar prato</h1>
          </header>

          <div>
            <Section title="Imagem do prato principal">
              <Image className="image">
                <label htmlFor="image">
                  <FiUpload size={"2.4rem"} />
                  <span>{fileName || "Selecione imagem"}</span>

                  <input 
                    id="image" 
                    type="file"
                    onChange={handleImageChange}
                  />
                </label>
              </Image>
            </Section>

            <Section title="Nome">
              <Input className="name"
                placeholder="Ex.: Lagosta ao thermidor"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </Section>

            <Section title="Categoria">
              <Category className="category">
                <label htmlFor="category">
                  <select 
                    id="category" 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    <option value="">Selecionar</option>
                    <option value="meal">Prato Principal</option>
                    <option value="dessert">Sobremesa</option>
                    <option value="beverage">Bebida</option>
                  </select>

                  <RiArrowDownSLine size={"2.4rem"} />
                </label>
              </Category>
            </Section>
          </div>

          <div>
            <Section title="Ingredientes">
              <div className="tags">
                {
                  tags.map((tag, index) => (
                    <FoodItem
                      key={String(index)}
                      value={tag}
                      onClick={() => handleRemoveTag(tag)}
                    />
                  ))
                }

                <FoodItem
                  isNew
                  placeholder="Adicionar"
                  onChange={(e) => setNewTag(e.target.value)}
                  value={newTag}
                  onClick={handleAddTag}
                />
              </div>
            </Section>

            <Section title="Preço">
              <Input className="price"
                placeholder="R$ 00,00" 
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </Section>
          </div>

          <Section title="Descrição">
            <Textarea 
              placeholder="Forneça uma breve apresentação do prato, destacando seus ingredientes e composição"
              onChange={(e) => setDescription(e.target.value)}
            />
          </Section>

          <div className="save">
            <Button
              title="Salvar alterações"
              onClick={handleNewDish}
              loading={loading}
            />
          </div>
        </Form>
      </main>
      
      <Footer />
    </Container>
  );
}
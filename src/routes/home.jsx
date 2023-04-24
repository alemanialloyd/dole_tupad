import banner from '../banner.jpg';

const Home = () => {
    return (
        <div style={{height: `calc(100vh - 76px)`, backgroundImage: `url(${banner})`, backgroundSize: "cover", backgroundPosition: "center"}}></div>
    )
}

export default Home;
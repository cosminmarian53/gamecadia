import '../styles/footer.css';




function Footer() 
{
    const date = new Date();
    const currentYear = date.getFullYear();
    

    return(
        <footer>
            <p>© {currentYear} Gamecadia. <br></br>Toate drepturile rezervate.</p>
        </footer>   

    )

}

export default Footer;

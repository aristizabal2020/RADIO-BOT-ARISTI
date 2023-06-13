const { EmbedBuilder } = require("discord.js");

module.exports = {

    helpMsg: (interaction, client) => {
  
      switch (interaction.locale){
  
        case 'en-US':
          //English
          return new EmbedBuilder()
          .setColor("White")
          .setTitle('426 FM')
          .setURL('https://426fm.com/')
          .setDescription(`426 fm Metaverse Radio is an immersive internet radio station that takes you on a cosmic journey through the Metaverse. Tune in to experience a selection of space-themed music, electrifying DJ sets, and captivating content form the best content creators of the community. Our radio station bot transports you to distant galaxies and ignites your imagination!\n\n`+
          `**Commands**\n\n`+
          `\`/role\` this command establishes a role to act as the radio administrator, only users with this role will be able to use all the commands, otherwise the bot will throw a communication error and will not respond.\n\n`+
          `\`/join\` this command requests 1 parameter and it is an eligible list of available voice channels. It is important to note that in order to join the voice channel the bot must have the necessary permissions to join to play the radio. If for some reason you do not choose a voice channel, it will respond that you must first choose one before joining a voice channel.\n\n`+
          `\`/show-role\` a simple but useful command, we may have forgotten which role we configured as administrator.\n\n`+
          `\`/stop\` as the name implies, simply terminates the current voice connection of the radio.\n\n`+
          `\`/ping\` a simple command that shows our current connection.\n\n`
          )
          .setThumbnail(client.user.displayAvatarURL())
          .setTimestamp()
  
        case 'es-ES':
          //Español
          return new EmbedBuilder()
          .setColor("White")
          .setTitle('426 FM')
          .setURL('https://426fm.com/')
          .setDescription(`426 fm Metaverse Radio es una emisora de radio por Internet que te sumerge en un viaje cósmico a través del Metaverso. Sintonízala para disfrutar de una selección de música de temática espacial, electrizantes sesiones de DJ y contenidos cautivadores de los mejores creadores de contenido de la comunidad. Nuestra emisora de radio te transporta a galaxias lejanas y enciende tu imaginación.\n\n`+
          `**Comandos**\n\n`+
          `\`/role\` este comando establece un rol que haga las veces de administrador de la radio, solo los usuarios con dicho rol podrán hacer uso de todos los comandos, de lo contrario el bot arrojará un error de comunicación y no responderá.\n\n`+
          `\`/join\` este comando solicita 1 parámetro y es una lista elegible de los canales de voz disponibles. Importante tener en cuenta que para que se pueda unir al canal de voz el bot debe tener los permisos necesarios para unirse a reproducir la radio. Si por alguna razón no eliges un canal de voz, te responderá que debes primero elegir uno antes de unirse a un canal de voz.\n\n`+
          `\`/show-role\` un comando simple pero útil, quizás se nos haya olvidado que rol configuramos de administrador.\n\n`+
          `\`/stop\` como su nombre lo indica, simplemente termina la conexión de voz actual de la radio.\n\n`+
          `\`/ping\` un simple comandos que nos muestra nuestra conexión actual.\n\n`
          )
          .setThumbnail(client.user.displayAvatarURL())
          .setTimestamp()
  
        case 'pt-BR':
          //Portugués
          return new EmbedBuilder()
          .setColor("White")
          .setTitle('426 FM')
          .setURL('https://426fm.com/')
          .setDescription(`426 fm Metaverse Radio é uma estação de rádio imersiva na Internet que te leva numa viagem cósmica através do Metaverso. Sintoniza para ouvires uma selecção de música com temas espaciais, DJ sets electrizantes e conteúdos cativantes dos melhores criadores de conteúdos da comunidade. O bot da nossa estação de rádio transporta-o para galáxias distantes e dá asas à sua imaginação!.\n\n`+
          `**Comandos**\n\n`+
          `\`/role\` este comando define uma função para actuar como administrador de rádio, apenas os utilizadores com esta função poderão utilizar todos os comandos, caso contrário o bot lançará um erro de comunicação e não responderá.\n\n`+
          `\`/join\` este comando pede 1 parâmetro e é uma lista elegível de canais de voz disponíveis. É importante notar que, para entrar no canal de voz, o bot deve ter as permissões necessárias para entrar e tocar o rádio. Se, por alguma razão, não escolheres um canal de voz, ele responderá que tens de escolher um antes de te juntares a um canal de voz.\n\n`+
          `\`/show-role\` um comando simples mas útil, podemos ter-nos esquecido da função que definimos como administrador.\n\n`+
          `\`/stop\` como o nome sugere, termina simplesmente a ligação de voz actual do rádio.\n\n`+
          `\`/ping\` um comando simples que mostra a nossa ligação actual.\n\n`
          )
          .setThumbnail(client.user.displayAvatarURL())
          .setTimestamp()
  
        default:
  
            //ENGLISH DEFAULT
            return new EmbedBuilder()
            .setColor(0x0099FF)
            .setAuthor({ name: 'Coffee', iconURL: client.user.displayAvatarURL(), url: 'https://discord.js.org' })
            .setDescription(`¡Ganaste un grano de café... estás teniendo suerte, por ahora... +${points} punto! ☕\n\n`+
            `✔ Total Points: **${totalPoints}** \n`)
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp() 
      }
      
    }
  } 
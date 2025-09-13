import { Card, CardContent } from "@/components/ui/card";

const AboutUs = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Skill Team</h2>
          <p className="text-xl opacity-90 max-w-4xl mx-auto">
            Meet the brilliant minds behind this project — visionaries, developers, and mentors who brought this vision to life
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">
            <span className="border-b-4 border-blue-300 pb-2">Developer Team</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-bold mb-2">Vedant Bhatt</h4>
                <p className="text-blue-200 mb-1">Frontend Developer</p>
                <p className="text-sm opacity-80">24CE013</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-bold mb-2">Jash Baldha</h4>
                <p className="text-blue-200 mb-1">Backend Developer</p>
                <p className="text-sm opacity-80">24CE004</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-bold mb-2">Ansh Darji</h4>
                <p className="text-blue-200 mb-1">Frontend Developer</p>
                <p className="text-sm opacity-80">24CE022</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-bold mb-2">Kalp Ka.Patel</h4>
                <p className="text-blue-200 mb-1">Backend Developer</p>
                <p className="text-sm opacity-80">24CE045</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-bold mb-2">Krrish Bhardwaj</h4>
                <p className="text-blue-200 mb-1">Full Stack Developer</p>
                <p className="text-sm opacity-80">24CE010</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold text-center mb-12">
            <span className="border-b-4 border-cyan-300 pb-2">Faculty Core Team</span>
          </h3>
          <div className="flex justify-center">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 max-w-md">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">R</span>
                </div>
                <h4 className="text-2xl font-bold mb-2">Prof. Ronak R Patel</h4>
                <p className="text-cyan-200 text-lg">Project Mentor</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
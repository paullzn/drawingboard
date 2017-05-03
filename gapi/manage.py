# coding: utf-8

import urllib

from flask_script import Manager, Server, prompt_bool
from flask_script.commands import ShowUrls, Clean

from app import create_app

app = create_app()

manager = Manager(app)
manager.add_command("runserver", Server(host='0.0.0.0', port=8219))
manager.add_command("show_urls", ShowUrls())
manager.add_command("clean", Clean())


@manager.shell
def make_shell_context():
    return dict(app=app)

@manager.command
def list_routes():
    output = []
    for rule in app.url_map.iter_rules():
        rule_methods = rule.methods
        methods = ','.join(rule_methods)
        line = urllib.unquote("{:50s} {:20s} {}".format(rule.endpoint, methods, rule))
        output.append(line)

    for line in sorted(output):
        print line

if __name__ == "__main__":
    manager.run()

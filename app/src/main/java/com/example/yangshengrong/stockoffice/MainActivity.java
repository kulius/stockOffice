package com.example.yangshengrong.stockoffice;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.BottomNavigationView;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.widget.TextView;
import XmlRpcClient;

public class MainActivity extends AppCompatActivity {

    final String url = "35.201.141.251",
    db = "odoo8_app",
    username = "admin",
    password = "admin";


    final XmlRpcClient client = new XmlRpcClient();

    final XmlRpcClientConfigImpl start_config = new XmlRpcClientConfigImpl();
start_config.setServerURL(new URL("https://demo.odoo.com/start"));
    final Map<String, String> info = (Map<String, String>)client.execute(
            start_config, "start", emptyList());

    final String url = info.get("host"),
            db = info.get("database"),
            username = info.get("user"),
            password = info.get("password");


    private TextView mTextMessage;

    private BottomNavigationView.OnNavigationItemSelectedListener mOnNavigationItemSelectedListener
            = new BottomNavigationView.OnNavigationItemSelectedListener() {

        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem item) {
            switch (item.getItemId()) {
                case R.id.navigation_home:
                    mTextMessage.setText(R.string.title_home);
                    return true;
                case R.id.navigation_dashboard:
                    mTextMessage.setText(R.string.title_dashboard);
                    return true;
                case R.id.navigation_notifications:
                    mTextMessage.setText(R.string.title_notifications);
                    return true;
            }
            return false;
        }

    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mTextMessage = (TextView) findViewById(R.id.message);
        BottomNavigationView navigation = (BottomNavigationView) findViewById(R.id.navigation);
        navigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener);
    }

}
